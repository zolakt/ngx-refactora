import { Injectable, Inject } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { WebAuth } from 'auth0-js';
import { AuthProvider, AUTH_CONFIG, RefactoraAuthConfig } from '@ngx-refactora/auth';

import { Subscription, ReplaySubject, Observable, of, timer } from 'rxjs';
import { skip, mergeMap, distinctUntilChanged } from 'rxjs/operators';
import { StorageService } from '@ngx-refactora/common/public_api';

export interface RefactoraAuth0Config extends RefactoraAuthConfig {
	externalTokenName?: string;
	externalTokenNamespace?: string;
}

@Injectable()
export class Auth0AuthProvider implements AuthProvider {
	private auth: WebAuth;
	private refreshSubscription: Subscription;

	private userDataSubject$: ReplaySubject<any> = new ReplaySubject(1);
	private userDataInitialized: boolean;

	constructor(
		@Inject(AUTH_CONFIG) private config: RefactoraAuth0Config,
		@Inject(APP_BASE_HREF) originUrl: string,
		private storage: StorageService
	) {
		const redirectPath = config.redirectUri ? config.redirectUri : '/';
		const redirectUrl = originUrl.replace(/\/$/, '') + redirectPath;

		this.auth = new WebAuth({
			clientID: config.clientId,
			domain: config.identityUrl,
			responseType: config.responseType,
			audience: config.audience,
			redirectUri: redirectUrl,
			scope: config.scope
		});
	}

	getIsAuthorized(): Observable<boolean> {
		return of(this.isAuthenticated());
	}

	getToken(type?: string): any {
		const tokenKey = (type && type === this.config.externalTokenName) ?
			this.config.externalTokenName :
			(type && type === 'id_token') ? 'id_token' : 'access_token';

		return this.storage.get(tokenKey);
	}

	private getExpiration(): string {
		return this.storage.get('expires_at');
	}

	getUserData(refresh?: boolean): Observable<any> {
		const accessToken = this.getToken();
		if (!accessToken || !this.isAuthenticated()) {
			return of(null);
		}

		if (refresh || !this.userDataInitialized) {
			this.auth.client.userInfo(accessToken, (err: any, profile: any) => {
				this.userDataInitialized = true;
				this.userDataSubject$.next(profile);
			});
		}

		return this.userDataSubject$.asObservable().pipe(
			skip(refresh ? 1 : 0),
			distinctUntilChanged()
		);
	}

	login(): void {
		this.auth.authorize();
	}

	refreshSession(): void {
		this.handleAuthentication();
		this.scheduleRenewal();
	}

	logout(): void {
		this.clearStorage();
		this.unscheduleRenewal();
	}

	private isAuthenticated(): boolean {
		const expiresAt = '' + this.getExpiration();
		return new Date().getTime() < JSON.parse(expiresAt);
	}

	private handleAuthentication(): void {
		this.auth.parseHash((err, authResult) => {
			if (authResult && authResult.accessToken && authResult.idToken) {
				this.setSession(authResult);
			}
		});
	}

	private scheduleRenewal(): void {
		if (!this.isAuthenticated()) {
			return;
		}

		this.unscheduleRenewal();

		const expiresAt = JSON.parse('' + this.getExpiration());

		const source = of(expiresAt).pipe(
			mergeMap(exp => {
				const now = Date.now();
				return timer(Math.max(1, exp - now));
			})
		);

		this.refreshSubscription = source.subscribe(() => {
			this.renewToken();
			this.scheduleRenewal();
		});
	}

	private renewToken(): void {
		this.auth.checkSession({}, (err, result) => {
			if (result) {
				this.setSession(result);
			}
		});
	}

	private unscheduleRenewal(): void {
		if (this.refreshSubscription) {
			this.refreshSubscription.unsubscribe();
		}
	}

	private setSession(authResult: any): void {
		const expiresAt = JSON.stringify(authResult.expiresIn * 1000 + new Date().getTime());
		this.storage.set('access_token', authResult.accessToken);
		this.storage.set('id_token', authResult.idToken);
		this.storage.set('expires_at', expiresAt);

		if (this.config.externalTokenName && authResult.idTokenPayload) {
			const extTokenPath = this.config.externalTokenNamespace + this.config.externalTokenName;
			const token = authResult.idTokenPayload[extTokenPath] || null;
			this.storage.set(this.config.externalTokenName, token);
		}
	}

	private clearStorage(): void {
		this.storage.delete('access_token');
		this.storage.delete('id_token');
		this.storage.delete('expires_at');

		if (this.config.externalTokenName) {
			this.storage.delete(this.config.externalTokenName);
		}
	}
}

import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { APP_BASE_HREF, isPlatformBrowser } from '@angular/common';
import { WebAuth } from 'auth0-js';
import { AuthProviderInterface } from '@ngx-refactora/auth';

import { Subscription, ReplaySubject, Observable, of, timer } from 'rxjs';
import { skip, mergeMap, distinctUntilChanged } from 'rxjs/operators';

@Injectable()
export class Auth0AuthProvider implements AuthProviderInterface {
	private auth: WebAuth;
	private refreshSubscription: Subscription;
	private redirectPath: string;

	private userDataSubject$: ReplaySubject<any> = new ReplaySubject(1);
	private userDataInitialized: boolean;

	constructor(
		@Inject(PLATFORM_ID) private platformId: Object,
		@Inject(APP_BASE_HREF) originUrl: string,
		@Inject('APP_CONFIG') appConfig: any
	) {
		this.redirectPath = appConfig.authRedirectPath ? appConfig.authRedirectPath : '/admin';
		const redirectUrl = originUrl.replace(/\/$/, '') + this.redirectPath;

		this.auth = new WebAuth({
			clientID: appConfig.clientId,
			domain: appConfig.identityUrl,
			responseType: appConfig.clientResponseType,
			audience: appConfig.audience,
			redirectUri: redirectUrl,
			scope: appConfig.clientScope
		});
	}

	getIsAuthorized(): Observable<boolean> {
		return of(this.isAuthenticated());
	}

	getToken(): any {
		return this.getFromStorage('access_token');
	}

	getUserData(refresh?: boolean): Observable<any> {
		const accessToken = this.getFromStorage('access_token');
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
		this.removeFromStorage('access_token');
		this.removeFromStorage('id_token');
		this.removeFromStorage('expires_at');
		this.unscheduleRenewal();
	}

	private isAuthenticated(): boolean {
		const expiresAt = '' + this.getFromStorage('expires_at');
		return new Date().getTime() < JSON.parse(expiresAt);
	}

	private handleAuthentication(): void {
		this.auth.parseHash((err, authResult) => {
			if (authResult && authResult.accessToken && authResult.idToken) {
				this.setSession(authResult);
				location.replace(this.redirectPath);
			}
		});
	}

	private setSession(authResult: any): void {
		const expiresAt = JSON.stringify(authResult.expiresIn * 1000 + new Date().getTime());
		this.saveToStorage('access_token', authResult.accessToken);
		this.saveToStorage('id_token', authResult.idToken);
		this.saveToStorage('expires_at', expiresAt);
	}

	private scheduleRenewal(): void {
		if (!this.isAuthenticated()) {
			return;
		}

		this.unscheduleRenewal();

		const expiresAt = JSON.parse('' + this.getFromStorage('expires_at'));

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

	private getFromStorage(key: string): string {
		return isPlatformBrowser(this.platformId) ? localStorage.getItem(key) : null;
	}

	private saveToStorage(key: string, value: string): void {
		if (isPlatformBrowser(this.platformId)) {
			localStorage.setItem(key, value);
		}
	}

	private removeFromStorage(key: string): void {
		if (isPlatformBrowser(this.platformId)) {
			localStorage.removeItem(key);
		}
	}
}

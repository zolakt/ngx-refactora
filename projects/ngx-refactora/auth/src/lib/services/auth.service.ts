import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthProvider } from '../interfaces/auth.provider';

@Injectable()
export class AuthService {
	constructor(protected authProvider: AuthProvider) {}

	getIsAuthorized(): Observable<boolean> {
		return this.authProvider.getIsAuthorized();
	}

	getToken(): any {
		return this.authProvider.getToken();
	}

	getUserData(refresh?: boolean): Observable<any> {
		return this.authProvider.getUserData(refresh);
	}

	login(): any {
		return this.authProvider.login();
	}

	logout(redirect?: boolean): void {
		this.authProvider.logout();

		if (redirect) {
			location.replace('/');
		}
	}

	refreshSession(): void {
		this.authProvider.refreshSession();
	}
}

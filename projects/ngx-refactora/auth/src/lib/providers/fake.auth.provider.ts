import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AuthProvider } from '../interfaces/auth.provider';

@Injectable()
export class FakeAuthProvider implements AuthProvider {
	getIsAuthorized(): Observable<boolean> {
		return of(false);
	}

	getToken(type?: string): any {
		return null;
	}

	getUserData(refresh?: boolean): Observable<any> {
		return of(null);
	}

	login(): void {}

	logout(): void {}

	refreshSession(): void {}
}

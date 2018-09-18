import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AuthProviderInterface } from '../interfaces/auth.provider.interface';

@Injectable()
export class FakeAuthProvider implements AuthProviderInterface {
	getIsAuthorized(): Observable<boolean> {
		return of(false);
	}

	getToken(): any {
		return null;
	}

	getUserData(refresh?: boolean): Observable<any> {
		return of(null);
	}

	login(): void {}

	logout(): void {}

	refreshSession(): void {}
}

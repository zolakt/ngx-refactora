import { Observable } from 'rxjs';

export abstract class AuthProvider {
	abstract getIsAuthorized(): Observable<boolean>;
	abstract getToken(type?: string): any;
	abstract getUserData(refresh?: boolean): Observable<any>;
	abstract login(): any;
	abstract logout(): any;
	abstract refreshSession(): any;
}

import { Observable } from 'rxjs';

export abstract class AuthProviderInterface {
	abstract getIsAuthorized(): Observable<boolean>;
	abstract getToken(): any;
	abstract getUserData(refresh?: boolean): Observable<any>;
	abstract login(): any;
	abstract logout(): any;
	abstract refreshSession(): any;
}

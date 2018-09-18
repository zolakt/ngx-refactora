import { Observable } from 'rxjs';

export abstract class PermissionServiceInterface<TUserType> {
	abstract getPermissions(refresh?: boolean): Observable<TUserType>;
}

import { Observable } from 'rxjs';

export abstract class PermissionService<TUserType> {
	abstract getPermissions(refresh?: boolean): Observable<TUserType>;
}

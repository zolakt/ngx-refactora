import { Observable } from 'rxjs';

export abstract class UserService<TUserType> {
	abstract getUserByExternal(id: any, refresh?: boolean): Observable<TUserType>;
}

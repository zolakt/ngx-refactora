import { Observable } from 'rxjs';

export abstract class UserServiceInterface<TUserType> {
	abstract getUserByExternal(id: any, refresh?: boolean): Observable<TUserType>;
}

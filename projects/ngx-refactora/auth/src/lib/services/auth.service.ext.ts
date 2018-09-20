import { Injectable, Optional } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { AuthProvider } from '../interfaces/auth.provider';
import { UserService } from '../interfaces/user.service';
import { PermissionService } from '../interfaces/permission.service';

@Injectable()
export class AuthServiceExt extends AuthService {
	constructor(
		authProvider: AuthProvider,
		protected userService: UserService<any>,
		@Optional() protected permissionService: PermissionService<any>
	) {
		super(authProvider);
	}

	getCurrentUser(refresh?: boolean): Observable<any> {
		return this.getUserData().pipe(mergeMap(res => {
			return (res && res.sub && this.userService) ? this.userService.getUserByExternal(res.sub, refresh) : of(null);
		}));
	}

	checkPermission(permission: string, user?: any, refresh?: boolean): Observable<boolean> {
		return this.permissionService ? this.permissionService.getPermissions(refresh).pipe(mergeMap((permissions: any) => {
			const perm = permissions[permission];

			if (user) {
				// tslint:disable-next-line:no-bitwise
				return of(user.permission && (user.permission & perm) > 0);
			}

			return this.getCurrentUser(refresh).pipe(map(x => {
				// tslint:disable-next-line:no-bitwise
				return x && x.permission && (x.permission & perm) > 0;
			}));
		})) : of(false);
	}
}

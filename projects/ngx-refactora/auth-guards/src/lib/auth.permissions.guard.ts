import { Injectable } from '@angular/core';
import {
	Router,
	ActivatedRouteSnapshot,
	RouterStateSnapshot,
	CanActivate,
	CanActivateChild
} from '@angular/router';
import { AuthServiceExt } from '@ngx-refactora/auth';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class AuthPermissionsGuard implements CanActivate, CanActivateChild {
	constructor(private authService: AuthServiceExt, private router: Router) {}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
		const data = route.data['permissions'];

		const loginRedirect = (route.data['loginRedirect']) ? route.data['loginRedirect'] : null;

		if (data) {
			return this.authService.checkPermission(data).pipe(map(result => {
				if (!result) {
					this.handleUnauthorized(loginRedirect);
				}
				return result;
			}));
		}

		return this.authService.getIsAuthorized().pipe(map(result => {
			if (!result) {
				this.handleUnauthorized(loginRedirect);
			}
			return result;
		}));
	}

	canActivateChild(
		childRoute: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): boolean | Observable<boolean> | Promise<boolean> {
		const data = childRoute.data['permissions'];

		const loginRedirect = (childRoute.data['loginRedirect']) ? childRoute.data['loginRedirect'] : null;

		if (data) {
			return this.authService.checkPermission(data).pipe(map(result => {
				if (!result) {
					this.handleUnauthorized(loginRedirect);
				}
				return result;
			}));
		}

		return this.authService.getIsAuthorized().pipe(map(result => {
			if (!result) {
				this.handleUnauthorized(loginRedirect);
			}
			return result;
		}));
	}

	protected handleUnauthorized(loginRedirect: string) {
		if (loginRedirect) {
			this.router.navigate([loginRedirect]);
		} else {
			this.authService.login();
		}
	}
}

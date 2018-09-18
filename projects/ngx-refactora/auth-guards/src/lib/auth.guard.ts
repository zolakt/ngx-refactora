import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '@ngx-refactora/auth';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private authService: AuthService, private router: Router) {}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
		const loginRedirect = (route.data['loginRedirect']) ? route.data['loginRedirect'] : null;

		this.authService.getIsAuthorized().subscribe(
			result => {
				if (!result) {
					this.handleUnauthorized(loginRedirect);
				}
				return result;
			},
			error => console.log(error)
		);

		return true;
	}

	protected handleUnauthorized(loginRedirect: string) {
		if (loginRedirect) {
			this.router.navigate([loginRedirect]);
		} else {
			this.authService.login();
		}
	}
}

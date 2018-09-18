import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '@ngx-refactora/auth';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
	private auth: AuthService;

	constructor(private injector: Injector) {}

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		if (this.auth === undefined) {
			this.auth = this.injector.get(AuthService);
		}

		if (this.auth !== undefined) {
			const token = this.auth.getToken();

			if (token) {
				const tokenValue = 'Bearer ' + token;

				// Clone the request to add the new header.
				const authReq = req.clone({
					setHeaders: {
						// 'Content-Type': 'application/json',
						Authorization: tokenValue
					}
				});

				// Pass on the cloned request instead of the original request.
				return next.handle(authReq);
			}
		}

		return next.handle(req);
	}
}

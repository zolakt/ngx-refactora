import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
	HttpInterceptor,
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
	constructor(private router: Router) {}

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		return next.handle(req).pipe(
			tap(
				event => {},
				err => {
					if (err instanceof HttpErrorResponse && err.status === 401) {
						this.handleUnauthorized();
					}
				}
			)
		);
	}

	protected handleUnauthorized() {
		this.router.navigate(['/unauthorized']);
	}
}

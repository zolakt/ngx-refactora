import { Injectable, OnDestroy } from '@angular/core';
import { OidcSecurityService, OidcConfigService, OpenIDImplicitFlowConfiguration, AuthWellKnownEndpoints } from 'angular-auth-oidc-client';
import { AuthProviderInterface } from '@ngx-refactora/auth';

import { Observable } from 'rxjs';

@Injectable()
export class OidcAuthProvider implements AuthProviderInterface, OnDestroy {
	constructor(
		private oidcSecurityService: OidcSecurityService,
		private oidcConfigService: OidcConfigService
	) {
		this.oidcConfigService.onConfigurationLoaded.subscribe(() => {
			const oidcConfig = new OpenIDImplicitFlowConfiguration();
			oidcConfig.stsServer = this.oidcConfigService.clientConfiguration.stsServer;
			oidcConfig.redirect_url = this.oidcConfigService.clientConfiguration.redirect_url;
			oidcConfig.client_id = this.oidcConfigService.clientConfiguration.client_id;
			oidcConfig.response_type = this.oidcConfigService.clientConfiguration.response_type;
			oidcConfig.scope = this.oidcConfigService.clientConfiguration.scope;
			oidcConfig.post_logout_redirect_uri = this.oidcConfigService.clientConfiguration.post_logout_redirect_uri;
			oidcConfig.start_checksession = this.oidcConfigService.clientConfiguration.start_checksession;
			oidcConfig.silent_renew = this.oidcConfigService.clientConfiguration.silent_renew;
			oidcConfig.silent_renew_url = this.oidcConfigService.clientConfiguration.silent_renew_url;
			oidcConfig.post_login_route = this.oidcConfigService.clientConfiguration.startup_route;
			oidcConfig.forbidden_route = this.oidcConfigService.clientConfiguration.forbidden_route;
			oidcConfig.unauthorized_route = this.oidcConfigService.clientConfiguration.unauthorized_route;
			oidcConfig.log_console_warning_active = this.oidcConfigService.clientConfiguration.log_console_warning_active;
			oidcConfig.log_console_debug_active = this.oidcConfigService.clientConfiguration.log_console_debug_active;
			// tslint:disable-next-line:max-line-length
			oidcConfig.max_id_token_iat_offset_allowed_in_seconds = this.oidcConfigService.clientConfiguration.max_id_token_iat_offset_allowed_in_seconds;

			const authWellKnownEndpoints = new AuthWellKnownEndpoints();
			authWellKnownEndpoints.setWellKnownEndpoints(this.oidcConfigService.wellKnownEndpoints);

			this.oidcSecurityService.setupModule(
				oidcConfig,
				authWellKnownEndpoints
			);

			if (this.oidcSecurityService.moduleSetup) {
				this.doCallbackLogicIfRequired();
			} else {
				this.oidcSecurityService.onModuleSetup.subscribe(() => {
					this.doCallbackLogicIfRequired();
				});
			}
		});
	}

	getIsAuthorized(): Observable<boolean> {
		return this.oidcSecurityService.getIsAuthorized();
	}

	getToken(): any {
		return this.oidcSecurityService.getToken();
	}

	getUserData(refresh?: boolean): Observable<any> {
		return this.oidcSecurityService.getUserData();
	}

	login(): void {
		this.oidcSecurityService.authorize();
	}

	refreshSession(): void {
		this.oidcSecurityService.authorize();
	}

	logout(): void {
		this.oidcSecurityService.logoff();
	}

	ngOnDestroy(): void {
		this.oidcSecurityService.onModuleSetup.unsubscribe();
	}

	private doCallbackLogicIfRequired(): void {
		if (typeof location !== 'undefined' && window.location.hash) {
			this.oidcSecurityService.authorizedCallback();
		}
	}
}

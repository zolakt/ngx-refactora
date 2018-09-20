import { InjectionToken } from '@angular/core';

export const AUTH_CONFIG = new InjectionToken<RefactoraAuthConfig>('REFACTORA_AUTH_CONFIG');

export interface RefactoraAuthConfig {
	clientId: string;
	identityUrl: string;
	responseType: string;
	audience: string;
	redirectUri: string;
	scope: string;
}

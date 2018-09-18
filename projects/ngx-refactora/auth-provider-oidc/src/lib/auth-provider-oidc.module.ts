import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RefactoraAuthModule } from '@ngx-refactora/auth';
import { OidcAuthProvider } from './oidc.auth.provider';

@NgModule({
	imports: [CommonModule, RefactoraAuthModule]
})
export class RefactoraAuthOidcModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: RefactoraAuthOidcModule,
			providers: [OidcAuthProvider]
		};
	}
}

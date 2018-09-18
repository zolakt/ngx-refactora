import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RefactoraAuthModule } from '@ngx-refactora/auth';
import { Auth0AuthProvider } from './auth0.auth.provider';

@NgModule({
	imports: [CommonModule, RefactoraAuthModule]
})
export class RefactoraAuth0Module {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: RefactoraAuth0Module,
			providers: [Auth0AuthProvider]
		};
	}
}

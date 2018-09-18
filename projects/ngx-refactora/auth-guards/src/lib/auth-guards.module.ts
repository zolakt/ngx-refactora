import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RefactoraAuthModule } from '@ngx-refactora/auth';
import { AuthGuard } from './auth.guard';
import { AuthPermissionsGuard } from './auth.permissions.guard';

@NgModule({
	imports: [
		CommonModule,
		RouterModule,
		RefactoraAuthModule
	]
})
export class RefactoraAuthGuardModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: RefactoraAuthGuardModule,
			providers: [
				AuthGuard,
				AuthPermissionsGuard
			]
		};
	}
}

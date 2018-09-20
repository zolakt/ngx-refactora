import { NgModule, ModuleWithProviders, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FakeAuthProvider } from './providers/fake.auth.provider';
import { AuthService } from './services/auth.service';
import { AuthServiceExt } from './services/auth.service.ext';
import { AuthProvider } from './interfaces/auth.provider';

@NgModule({
	imports: [CommonModule]
})
export class RefactoraAuthModule {
	static forRoot(provider?: Type<AuthProvider>): ModuleWithProviders {
		return {
			ngModule: RefactoraAuthModule,
			providers: [
				AuthService,
				AuthServiceExt,
				FakeAuthProvider,
				{
					provide: AuthProvider,
					useClass: provider || FakeAuthProvider
				}
			]
		};
	}
}

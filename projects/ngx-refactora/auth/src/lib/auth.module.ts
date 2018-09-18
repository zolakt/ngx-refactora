import { NgModule, ModuleWithProviders, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FakeAuthProvider } from './providers/fake.auth.provider';
import { AuthService } from './services/auth.service';
import { AuthServiceExt } from './services/auth.service.ext';
import { AuthProviderInterface } from './interfaces/auth.provider.interface';

@NgModule({
	imports: [CommonModule]
})
export class RefactoraAuthModule {
	static forRoot(provider?: Type<AuthProviderInterface>): ModuleWithProviders {
		return {
			ngModule: RefactoraAuthModule,
			providers: [
				AuthService,
				AuthServiceExt,
				{
					provide: AuthProviderInterface,
					useClass: provider || FakeAuthProvider
				}
			]
		};
	}
}

import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from './cart.service';

@NgModule({
	imports: [
		CommonModule
	]
})
export class RefactoraCartModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: RefactoraCartModule,
			providers: [
				CartService
			]
		};
	}
}

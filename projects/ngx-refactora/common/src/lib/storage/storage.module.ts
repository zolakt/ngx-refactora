import { NgModule, ModuleWithProviders, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageService } from './storage.service';
import { LocalStorageService } from './local.storage.service';

@NgModule({
	imports: [CommonModule]
})
export class RefactoraStorageModule {
	static forRoot(service?: Type<StorageService>): ModuleWithProviders {
		return {
			ngModule: RefactoraStorageModule,
			providers: [
				LocalStorageService,
				{
					provide: StorageService,
					useClass: service || LocalStorageService
				}
			]
		};
	}
}

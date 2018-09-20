import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { StorageService } from './storage.service';

export class LocalStorageService implements StorageService {
	constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

	get(key: string): any {
		return isPlatformBrowser(this.platformId) ? localStorage.getItem(key) : null;
	}

	set(key: string, value: any): void {
		if (isPlatformBrowser(this.platformId)) {
			localStorage.setItem(key, value);
		}
	}

	delete(key: string): void {
		if (isPlatformBrowser(this.platformId)) {
			localStorage.removeItem(key);
		}
	}
}

export abstract class StorageService {
	abstract get(key: string): any;
	abstract set(key: string, value: any): void;
	abstract delete(key: string): void;
}

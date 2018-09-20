import { HttpClient, HttpParams } from '@angular/common/http';
import { PagedResult } from './paged-result';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export abstract class RestService<T = any> {

	constructor(protected http: HttpClient, protected resourceUrl: string) { }

	getAll(data: { [index: string]: any } = {}): Observable<PagedResult<T>> {
		const params = this.bindParams(data);

		return this.http.get<T[]>(this.resourceUrl, { params: params, observe: 'response' })
			.pipe(map(res => {
				const count = Number(res.headers.get('X-Total-Count'));
				const tmp = res.body || [];
				return new PagedResult<T>(tmp, count);
			}));
	}

	getById(id: any, data: { [index: string]: any } = {}): Observable<T> {
		const url = `${this.resourceUrl}/${id}`;
		const params = this.bindParams(data);

		return this.http.get(url, { params: params })
			.pipe(map(res => res as T));
	}

	deleteById(id: any): Observable<boolean> {
		const url = `${this.resourceUrl}/${id}`;
		return this.http.delete(url)
			.pipe(map(res => res as boolean));
	}

	create(data: T): Observable<T> {
		return this.http.post(this.resourceUrl, data)
			.pipe(map(res => res as T));
	}

	update(data: T): Observable<T> {
		const url = `${this.resourceUrl}/${(<any>data).id}`;
		return this.http.put(url, data)
			.pipe(map(res => res as T));
	}

	protected bindParams(data: { [index: string]: any } = {}): HttpParams {
		let params = new HttpParams();

		Object.keys(data).forEach(function (key: string) {
			const tmp = data[key];

			if (tmp instanceof Array) {
				tmp.forEach(function(val: any) {
					params = params.append(key, String(val));
				});

			} else {
				params = params.append(key, String(data[key]));
			}
		}, data);

		return params;
	}
}

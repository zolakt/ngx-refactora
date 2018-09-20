export class PagedResult<TEntityType> {
	constructor(public data: TEntityType[], public total: number) {}
}

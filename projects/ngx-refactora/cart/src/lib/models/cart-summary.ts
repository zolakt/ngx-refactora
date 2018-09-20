export class CartSummary {
	constructor(init?: Partial<CartSummary>) {
		Object.assign(this, init);
	}

	total = 0;
	discountAmount = 0;
	taxAmount = 0;
	shippingCost = 0;

	get totalNet(): number { return this.total - this.discountAmount; }
	get totalGross(): number { return this.totalNet + this.taxAmount; }
	get totalWithShipping(): number { return this.totalGross + (this.shippingCost || 0); }
}

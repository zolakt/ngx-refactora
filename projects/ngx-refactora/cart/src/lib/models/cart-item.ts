export class CartItem {
	constructor(init?: Partial<CartItem>) {
		Object.assign(this, init);
	}

	id: any;
	title: string;
	description: string;
	imageUrl: string;
	quantity = 1;
	requireShipping = true;

	discount = 0;
	tax = 0;
	price = 0;

	get baseTotal(): number { return this.price * this.quantity; }
	get discountAmount(): number { return this.discount * this.baseTotal; }
	get totalNet(): number { return this.baseTotal - this.discountAmount; }
	get taxAmount(): number { return this.tax * this.totalNet; }
	get total(): number { return this.totalNet + this.taxAmount; }

	get priceNet(): number { return (1 - this.discount) * this.price; }
	get priceGross(): number { return (1 + this.tax) * this.price; }
}

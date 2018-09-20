import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, Observable } from 'rxjs';

import { StorageService } from '@ngx-refactora/common';
import { CartItem } from './models/cart-item';

const CART_KEY = 'cart';

@Injectable()
export class CartService {
	private products: CartItem[] = [];
	private cartSubject = new BehaviorSubject(<CartItem[]>[]);
	private cartStateSubject = new Subject<boolean>();

	constructor(private storage: StorageService) {
		const saved = JSON.parse(this.storage.get(CART_KEY)) || <CartItem[]>[];
		this.products = saved.map(x => Object.assign(new CartItem(), x) as CartItem);
		this.updateCart();
	}

	get items(): Observable<CartItem[]> {
		return this.cartSubject.asObservable();
	}

	get state(): Observable<boolean> {
		return this.cartStateSubject.asObservable();
	}

	addProduct(product: CartItem, quantity: number | null = 1): void {
		const existing = product.id ? this.products.findIndex(x => x.id === product.id) : null;

		if (existing !== -1) {
			this.products[existing].quantity += quantity || product.quantity;
		} else {
			product.quantity = quantity || product.quantity;
			this.products.push(product);
		}

		this.updateCart();
	}

	removeProduct(id: any, quantity: (number | null) = 1): void {
		const existing = (id && quantity > 0) ? this.products.findIndex(x => x.id === id) : null;

		if ((existing !== -1) && (this.products[existing].quantity - quantity) > 0) {
			this.products[existing].quantity -= quantity;
		} else {
			this.products = this.products.filter((_item) => _item.id !== id);
		}

		this.updateCart();
	}

	clearItems(): void {
		this.products = [];
		this.updateCart();
	}

	updateCartItems(items: CartItem[]): void {
		this.products = this.products.filter(x => items.findIndex(y => x.id === y.id) !== -1);

		for (const item of items) {
			let existing = this.products.find(x => x.id === item.id);
			existing = existing ? existing : new CartItem();

			existing.title = item.title ? item.title : existing.title;
			existing.description = item.description ? item.description : existing.description;
			existing.imageUrl = item.imageUrl ? item.imageUrl : existing.imageUrl;
			existing.quantity = item.quantity ? item.quantity : existing.quantity || 1;
			existing.price = item.price ? item.price : existing.price;
			existing.discount = item.price ? item.discount : existing.discount;
			existing.tax = item.price ? item.discount : existing.discount;
		}
	}

	changeState(state: boolean | null): void {
		this.cartStateSubject.next(state);
	}

	private updateCart(): void {
		if (this.storage) {
			this.storage.set(CART_KEY, JSON.stringify(this.products));
		}

		this.cartSubject.next(this.products);
	}
}

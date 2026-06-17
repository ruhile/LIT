import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from './product.service';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor: { name: string; hex: string };
  selectedSize: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$: Observable<CartItem[]> = this.cartItemsSubject.asObservable();

  private isCheckoutOpenSubject = new BehaviorSubject<boolean>(false);
  isCheckoutOpen$: Observable<boolean> = this.isCheckoutOpenSubject.asObservable();

  constructor() {
    this.loadCart();
  }

  private saveCart(items: CartItem[]) {
    localStorage.setItem('lit_cart', JSON.stringify(items));
    this.cartItemsSubject.next(items);
  }

  private loadCart() {
    const saved = localStorage.getItem('lit_cart');
    if (saved) {
      try {
        this.cartItemsSubject.next(JSON.parse(saved));
      } catch (e) {
        this.cartItemsSubject.next([]);
      }
    }
  }

  getCartItems(): CartItem[] {
    return this.cartItemsSubject.value;
  }

  addToCart(product: Product, quantity: number, color: { name: string; hex: string }, size: string) {
    const current = this.getCartItems();
    const existingIndex = current.findIndex(item => 
      item.product.id === product.id && 
      item.selectedColor.name === color.name && 
      item.selectedSize === size
    );

    if (existingIndex > -1) {
      current[existingIndex].quantity += quantity;
    } else {
      current.push({
        product,
        quantity,
        selectedColor: color,
        selectedSize: size
      });
    }
    this.saveCart([...current]);
  }

  removeFromCart(productId: string, colorName: string, size: string) {
    const current = this.getCartItems();
    const updated = current.filter(item => 
      !(item.product.id === productId && 
        item.selectedColor.name === colorName && 
        item.selectedSize === size)
    );
    this.saveCart(updated);
  }

  updateQuantity(productId: string, colorName: string, size: string, quantity: number) {
    if (quantity <= 0) {
      this.removeFromCart(productId, colorName, size);
      return;
    }
    
    const current = this.getCartItems();
    const item = current.find(item => 
      item.product.id === productId && 
      item.selectedColor.name === colorName && 
      item.selectedSize === size
    );

    if (item) {
      item.quantity = quantity;
      this.saveCart([...current]);
    }
  }

  clearCart() {
    this.saveCart([]);
  }

  getCartTotal(): number {
    return this.getCartItems().reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }

  getCartCount(): number {
    return this.getCartItems().reduce((count, item) => count + item.quantity, 0);
  }

  openCheckout() {
    this.isCheckoutOpenSubject.next(true);
  }

  closeCheckout() {
    this.isCheckoutOpenSubject.next(false);
  }
}

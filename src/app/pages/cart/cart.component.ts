import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CartService, CartItem } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  subtotal = 0;
  
  // Promo code variables
  promoCode = '';
  appliedPromo = false;
  promoDiscountPercentage = 0;
  promoError = '';
  promoSuccessMessage = '';
  
  private sub = new Subscription();

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.sub.add(
      this.cartService.cartItems$.subscribe(items => {
        this.cartItems = items;
        this.subtotal = this.cartService.getCartTotal();
      })
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  updateQuantity(item: CartItem, change: number) {
    const newQty = item.quantity + change;
    this.cartService.updateQuantity(
      item.product.id,
      item.selectedColor.name,
      item.selectedSize,
      newQty
    );
  }

  removeItem(item: CartItem) {
    this.cartService.removeFromCart(
      item.product.id,
      item.selectedColor.name,
      item.selectedSize
    );
  }

  applyPromoCode() {
    this.promoError = '';
    this.promoSuccessMessage = '';
    
    const code = this.promoCode.toUpperCase().trim();
    if (!code) return;
    
    if (code === 'LIT15') {
      this.appliedPromo = true;
      this.promoDiscountPercentage = 15;
      this.promoSuccessMessage = 'Promo code LIT15 applied! You saved 15% on your order.';
    } else if (code === 'WELCOME10') {
      this.appliedPromo = true;
      this.promoDiscountPercentage = 10;
      this.promoSuccessMessage = 'Promo code WELCOME10 applied! You saved 10% on your order.';
    } else {
      this.promoError = 'Invalid promo code. Try LIT15 or WELCOME10.';
      this.appliedPromo = false;
      this.promoDiscountPercentage = 0;
    }
  }

  removePromoCode() {
    this.appliedPromo = false;
    this.promoCode = '';
    this.promoDiscountPercentage = 0;
    this.promoSuccessMessage = '';
    this.promoError = '';
  }

  getShippingCost(): number {
    return 0;
  }

  getDiscountAmount(): number {
    return this.subtotal * (this.promoDiscountPercentage / 100);
  }

  getGrandTotal(): number {
    return this.subtotal - this.getDiscountAmount() + this.getShippingCost();
  }

  proceedToCheckout() {
    this.cartService.openCheckout();
  }
}

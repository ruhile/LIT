import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService, CartItem } from '../../services/cart.service';

@Component({
  selector: 'app-checkout-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout-modal.component.html',
  styleUrl: './checkout-modal.component.css'
})
export class CheckoutModalComponent implements OnInit, OnDestroy {
  isOpen = false;
  step = 1; // 1: Shipping, 2: Payment, 3: Success
  cartItems: CartItem[] = [];
  
  // Totals
  subtotal = 0;
  shipping = 0;
  discount = 0;
  grandTotal = 0;

  // Form states
  shippingForm = {
    name: '',
    email: '',
    address: '',
    city: '',
    zip: '',
    phone: ''
  };

  paymentForm = {
    method: 'card', // card, upi, cod
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    upiId: 'muhammedjabir227-1@okaxis'
  };

  // Success state
  orderId = '';
  isProcessing = false;

  private subs = new Subscription();

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit() {
    this.subs.add(
      this.cartService.isCheckoutOpen$.subscribe(open => {
        this.isOpen = open;
        if (open) {
          this.step = 1;
          this.loadCartDetails();
        }
      })
    );

    this.subs.add(
      this.cartService.cartItems$.subscribe(() => {
        if (this.isOpen) {
          this.loadCartDetails();
        }
      })
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  private loadCartDetails() {
    this.cartItems = this.cartService.getCartItems();
    this.subtotal = this.cartService.getCartTotal();
    this.shipping = 0;
    
    // We can fetch coupon savings if any, or compute base on mock discount.
    // For simplicity, let's look if there's any active discount in cart. Since cart discount isn't stored in service,
    // we can compute a default 10% coupon discount if checkout subtotal has some savings, or just leave it.
    // Let's check: we can calculate a discount if we assume a standard checkout discount or keep it 0. Let's make it 0 unless they used coupon in cart.
    // Wait, let's keep it simple: we calculate discount base on standard cart discount or make shipping calculator match cart.
    // Actually, we can check grandTotal directly.
    this.grandTotal = this.subtotal + this.shipping;
  }

  close() {
    this.cartService.closeCheckout();
  }

  nextStep() {
    if (this.step === 1) {
      // Basic validation
      if (!this.shippingForm.name || !this.shippingForm.email || !this.shippingForm.address || !this.shippingForm.city || !this.shippingForm.zip || !this.shippingForm.phone) {
        alert('Please fill out all shipping details.');
        return;
      }
      this.step = 2;
    }
  }

  prevStep() {
    if (this.step === 2) {
      this.step = 1;
    }
  }

  placeOrder() {
    if (this.paymentForm.method === 'card') {
      if (!this.paymentForm.cardName || !this.paymentForm.cardNumber || !this.paymentForm.cardExpiry || !this.paymentForm.cardCvv) {
        alert('Please fill out credit card details.');
        return;
      }
    } else if (this.paymentForm.method === 'upi') {
      if (!this.paymentForm.upiId) {
        alert('Please enter your UPI ID.');
        return;
      }
    }

    this.isProcessing = true;

    const items = this.cartItems.map(item => ({
      productId: item.product.id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      selectedColor: item.selectedColor,
      selectedSize: item.selectedSize
    }));

    const orderDetails = {
      shippingDetails: this.shippingForm,
      paymentDetails: {
        method: this.paymentForm.method,
        cardName: this.paymentForm.method === 'card' ? this.paymentForm.cardName : undefined,
        upiId: this.paymentForm.method === 'upi' ? this.paymentForm.upiId : undefined
      },
      items,
      subtotal: this.subtotal,
      shipping: this.shipping,
      grandTotal: this.grandTotal
    };

    this.cartService.placeOrder(orderDetails).subscribe({
      next: (res) => {
        this.isProcessing = false;
        this.orderId = res.orderId;
        this.step = 3;
        this.cartService.clearCart();
      },
      error: (err) => {
        this.isProcessing = false;
        alert(err?.error?.message || 'There was an error placing your order. Please try again.');
      }
    });
  }

  getUpiPaymentUri(): string {
    const merchantId = 'muhammedjabir227-1@okaxis';
    const merchantName = encodeURIComponent('LIT Store');
    const amount = this.grandTotal;
    const note = encodeURIComponent('Order Payment');
    return `upi://pay?pa=${merchantId}&pn=${merchantName}&am=${amount}&cu=INR&tn=${note}`;
  }

  getUpiQrCodeUrl(): string {
    const upiUri = this.getUpiPaymentUri();
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUri)}`;
  }

  finishCheckout() {
    this.close();
    this.router.navigate(['/']);
  }
}

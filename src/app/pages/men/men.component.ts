import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductService, Product } from '../../services/product.service';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-men',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './men.component.html',
  styleUrl: './men.component.css'
})
export class MenComponent implements OnInit, OnDestroy {
  menProducts: Product[] = [];
  private sub = new Subscription();

  constructor(
    private productService: ProductService,
    private wishlistService: WishlistService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.sub.add(
      this.productService.getProducts().subscribe(products => {
        // Filter for men items + men oversized items
        this.menProducts = products.filter(p => 
          p.category === 'men' || 
          (p.category === 'oversized' && p.id !== 'botanical-oversized-tee' && p.id !== 'globe-oversized-tee')
        );
      })
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  toggleWishlist(event: Event, product: Product) {
    event.stopPropagation();
    this.wishlistService.toggleWishlist(product);
  }

  isInWishlist(productId: string): boolean {
    return this.wishlistService.isInWishlist(productId);
  }

  quickAddToCart(event: Event, product: Product) {
    event.stopPropagation();
    const defaultColor = product.colors[0];
    const defaultSize = product.sizes[0] || 'M';
    this.cartService.addToCart(product, 1, defaultColor, defaultSize);
  }
}

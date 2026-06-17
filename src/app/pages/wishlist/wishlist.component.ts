import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../services/product.service';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
})
export class WishlistComponent implements OnInit, OnDestroy {
  wishlistItems: Product[] = [];
  private sub = new Subscription();

  constructor(
    private wishlistService: WishlistService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.sub.add(
      this.wishlistService.wishlist$.subscribe(items => {
        this.wishlistItems = items;
      })
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  removeItem(product: Product) {
    this.wishlistService.toggleWishlist(product);
  }

  moveToCart(product: Product) {
    // Add default color and size
    const defaultColor = product.colors[0];
    const defaultSize = product.sizes[0] || 'M';
    this.cartService.addToCart(product, 1, defaultColor, defaultSize);
    
    // Remove from wishlist
    this.wishlistService.toggleWishlist(product);
  }
}

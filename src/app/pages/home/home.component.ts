import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { HeroCarouselComponent } from '../../components/hero-carousel/hero-carousel.component';
import { ProductService, Product } from '../../services/product.service';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, HeroCarouselComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  newArrivals: Product[] = [];
  bestSellers: Product[] = [];
  
  private sub = new Subscription();

  constructor(
    private productService: ProductService,
    private wishlistService: WishlistService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    // Fetch New Arrivals
    this.sub.add(
      this.productService.getNewArrivals().subscribe(products => {
        this.newArrivals = products.slice(0, 6); // Display first 6
      })
    );

    // Fetch Best Sellers
    this.sub.add(
      this.productService.getBestSellers().subscribe(products => {
        this.bestSellers = products.slice(0, 6); // Display first 6
      })
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  toggleWishlist(event: Event, product: Product) {
    event.stopPropagation(); // Prevent navigation to details page
    this.wishlistService.toggleWishlist(product);
  }

  isInWishlist(productId: string): boolean {
    return this.wishlistService.isInWishlist(productId);
  }

  quickAddToCart(event: Event, product: Product) {
    event.stopPropagation(); // Prevent navigation
    // Add default color and size
    const defaultColor = product.colors[0];
    const defaultSize = product.sizes[0] || 'M';
    this.cartService.addToCart(product, 1, defaultColor, defaultSize);
    
    // Optional: display a small alert or badge effect
  }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { ProductService, Product } from '../../services/product.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  cartCount = 0;
  wishlistCount = 0;
  searchQuery = '';
  isMobileMenuOpen = false;
  isSearchFocused = false;
  
  searchResults: Product[] = [];
  allProducts: Product[] = [];
  
  private subs = new Subscription();

  constructor(
    private cartService: CartService,
    private wishlistService: WishlistService,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit() {
    // Subscribe to cart changes
    this.subs.add(
      this.cartService.cartItems$.subscribe(() => {
        this.cartCount = this.cartService.getCartCount();
      })
    );

    // Subscribe to wishlist changes
    this.subs.add(
      this.wishlistService.wishlist$.subscribe(items => {
        this.wishlistCount = items.length;
      })
    );

    // Load all products for search suggestions
    this.subs.add(
      this.productService.getProducts().subscribe(products => {
        this.allProducts = products;
      })
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  onSearchInput() {
    if (!this.searchQuery.trim()) {
      this.searchResults = [];
      return;
    }
    const query = this.searchQuery.toLowerCase().trim();
    this.searchResults = this.allProducts.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.category.toLowerCase().includes(query)
    ).slice(0, 5); // Limit suggestions to 5
  }

  onSearchFocus() {
    this.isSearchFocused = true;
  }

  onSearchBlur() {
    // Delay blur to allow clicking on suggestion link
    setTimeout(() => {
      this.isSearchFocused = false;
    }, 200);
  }

  executeSearch() {
    if (!this.searchQuery.trim()) return;
    this.router.navigate(['/products'], { queryParams: { search: this.searchQuery.trim() } });
    this.searchQuery = '';
    this.searchResults = [];
    this.isSearchFocused = false;
  }

  selectSuggestion(product: Product) {
    this.router.navigate(['/product', product.id]);
    this.searchQuery = '';
    this.searchResults = [];
    this.isSearchFocused = false;
  }
}

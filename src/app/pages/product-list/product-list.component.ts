import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ProductService, Product } from '../../services/product.service';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit, OnDestroy {
  allProducts: Product[] = [];
  filteredProducts: Product[] = [];
  
  // Filter variables
  selectedCategory = 'all';
  selectedSize = 'all';
  selectedColor = 'all';
  maxPrice = 2000;
  minPrice = 0;
  sortOption = 'featured';
  searchQuery = '';
  
  // Available filter options
  sizesList = ['S', 'M', 'L', 'XL', 'XXL'];
  colorsList = [
    { name: 'Black', hex: '#111111' },
    { name: 'White', hex: '#ffffff' },
    { name: 'Off-White', hex: '#f6f5f0' },
    { name: 'Beige', hex: '#ebd5b3' },
    { name: 'Grey', hex: '#9e9e9e' },
    { name: 'Brown', hex: '#5c4033' },
    { name: 'Pink', hex: '#e8c5c8' }
  ];

  isMobileFiltersOpen = false;
  private subs = new Subscription();

  constructor(
    private productService: ProductService,
    private wishlistService: WishlistService,
    private cartService: CartService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Load products
    this.subs.add(
      this.productService.getProducts().subscribe(products => {
        this.allProducts = products;
        
        // Listen to Query Params (Category & Search)
        this.subs.add(
          this.route.queryParams.subscribe(params => {
            if (params['category']) {
              this.selectedCategory = params['category'];
            } else {
              this.selectedCategory = 'all';
            }

            if (params['search']) {
              this.searchQuery = params['search'];
            } else {
              this.searchQuery = '';
            }

            this.applyFilters();
          })
        );
      })
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  applyFilters() {
    let result = [...this.allProducts];

    // Category Filter
    if (this.selectedCategory !== 'all') {
      if (this.selectedCategory === 'new-drops') {
        result = result.filter(p => p.isNewArrival);
      } else {
        result = result.filter(p => p.category === this.selectedCategory);
      }
    }

    // Size Filter
    if (this.selectedSize !== 'all') {
      result = result.filter(p => p.sizes.includes(this.selectedSize));
    }

    // Color Filter
    if (this.selectedColor !== 'all') {
      result = result.filter(p => p.colors.some(c => c.name === this.selectedColor));
    }

    // Price Filter
    result = result.filter(p => p.price <= this.maxPrice);

    // Search Query Filter
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase().trim();
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query)
      );
    }

    // Sorting
    if (this.sortOption === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (this.sortOption === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (this.sortOption === 'best-seller') {
      result.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
    } else {
      // Default / Featured: show new arrivals first
      result.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
    }

    this.filteredProducts = result;
  }

  clearFilters() {
    this.selectedCategory = 'all';
    this.selectedSize = 'all';
    this.selectedColor = 'all';
    this.maxPrice = 2000;
    this.searchQuery = '';
    this.applyFilters();
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

  toggleMobileFilters() {
    this.isMobileFiltersOpen = !this.isMobileFiltersOpen;
  }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductService, Product } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  product?: Product;
  relatedProducts: Product[] = [];
  
  // Selection states
  selectedColor?: { name: string; hex: string };
  selectedSize = '';
  quantity = 1;
  activeTab: 'description' | 'shipping' | 'returns' = 'description';
  
  // Toast notifications for user feedback
  toastMessage = '';
  showToast = false;
  
  private subs = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private wishlistService: WishlistService
  ) {}

  ngOnInit() {
    this.subs.add(
      this.route.params.subscribe(params => {
        const productId = params['id'];
        if (productId) {
          this.loadProduct(productId);
        }
      })
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  private loadProduct(id: string) {
    this.subs.add(
      this.productService.getProductById(id).subscribe(p => {
        if (!p) {
          // Redirect if product not found
          this.router.navigate(['/products']);
          return;
        }
        
        this.product = p;
        this.selectedColor = p.colors[0];
        this.selectedSize = p.sizes[0] || 'M';
        this.quantity = 1;
        this.activeTab = 'description';
        
        // Fetch related products
        this.loadRelatedProducts(p.category, p.id);
      })
    );
  }

  private loadRelatedProducts(category: string, currentProductId: string) {
    this.subs.add(
      this.productService.getProductsByCategory(category).subscribe(products => {
        // Exclude current product, limit to 4
        this.relatedProducts = products
          .filter(p => p.id !== currentProductId)
          .slice(0, 4);
      })
    );
  }

  selectColor(color: { name: string; hex: string }) {
    this.selectedColor = color;
  }

  selectSize(size: string) {
    this.selectedSize = size;
  }

  decrementQty() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  incrementQty() {
    this.quantity++;
  }

  addToCart() {
    if (!this.product || !this.selectedColor) return;
    
    this.cartService.addToCart(this.product, this.quantity, this.selectedColor, this.selectedSize);
    this.triggerToast(`Added ${this.quantity}x ${this.product.name} (${this.selectedSize}) to cart.`);
  }

  toggleWishlist() {
    if (!this.product) return;
    
    this.wishlistService.toggleWishlist(this.product);
    const added = this.wishlistService.isInWishlist(this.product.id);
    this.triggerToast(added ? 'Added to wishlist.' : 'Removed from wishlist.');
  }

  isInWishlist(): boolean {
    return this.product ? this.wishlistService.isInWishlist(this.product.id) : false;
  }

  switchTab(tab: 'description' | 'shipping' | 'returns') {
    this.activeTab = tab;
  }

  private triggerToast(message: string) {
    this.toastMessage = message;
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }
}

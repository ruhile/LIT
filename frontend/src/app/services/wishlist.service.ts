import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from './product.service';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private wishlistSubject = new BehaviorSubject<Product[]>([]);
  wishlist$: Observable<Product[]> = this.wishlistSubject.asObservable();

  constructor() {
    this.loadWishlist();
  }

  private saveWishlist(items: Product[]) {
    localStorage.setItem('lit_wishlist', JSON.stringify(items));
    this.wishlistSubject.next(items);
  }

  private loadWishlist() {
    const saved = localStorage.getItem('lit_wishlist');
    if (saved) {
      try {
        this.wishlistSubject.next(JSON.parse(saved));
      } catch (e) {
        this.wishlistSubject.next([]);
      }
    }
  }

  getWishlist(): Product[] {
    return this.wishlistSubject.value;
  }

  toggleWishlist(product: Product) {
    const current = this.getWishlist();
    const index = current.findIndex(item => item.id === product.id);

    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(product);
    }
    this.saveWishlist([...current]);
  }

  isInWishlist(productId: string): boolean {
    return this.getWishlist().some(item => item.id === productId);
  }
}

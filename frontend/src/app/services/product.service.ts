import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  colors: { name: string; hex: string }[];
  sizes: string[];
  category: 'men' | 'women' | 'oversized' | 'accessories' | 'new-drops';
  isBestSeller?: boolean;
  isNewArrival?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>('/api/products');
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`/api/products/${id}`);
  }

  getNewArrivals(): Observable<Product[]> {
    return this.http.get<Product[]>('/api/products?newArrivals=true');
  }

  getBestSellers(): Observable<Product[]> {
    return this.http.get<Product[]>('/api/products?bestSellers=true');
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return this.http.get<Product[]>(`/api/products?category=${category}`);
  }
}

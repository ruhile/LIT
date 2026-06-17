import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

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
  private products: Product[] = [
    {
      id: 'super-promo-dress',
      name: 'Super Promo Dress',
      price: 1,
      description: 'LIT Super Promo Dress. An exclusive 1-rupee flash sale fashion dress designed with a sleek fit and breathable cotton fabric.',
      images: ['assets/category-women.png'],
      colors: [
        { name: 'Red', hex: '#b32d2e' },
        { name: 'White', hex: '#ffffff' }
      ],
      sizes: ['S', 'M', 'L'],
      category: 'women',
      isNewArrival: true,
      isBestSeller: true
    },
    {
      id: 'special-promo-dress',
      name: 'Special Promo Dress',
      price: 10,
      description: 'LIT Special Promo Dress. A gorgeous limited-edition cotton knit dress with a bodycon fit, perfect for casual and semi-formal wear.',
      images: ['assets/category-women.png'],
      colors: [
        { name: 'Red', hex: '#b32d2e' },
        { name: 'Black', hex: '#111111' }
      ],
      sizes: ['S', 'M', 'L'],
      category: 'women',
      isNewArrival: true,
      isBestSeller: true
    },
    {
      id: 'rebels-oversized-tee',
      name: 'Rebels Oversized Tee',
      price: 1299,
      description: 'Streetwear for the bold. Featuring a high-quality screen print design on the back, crafted from premium heavyweight cotton for ultimate durability and a relaxed fit.',
      images: ['assets/category-men.png'],
      colors: [
        { name: 'Black', hex: '#111111' },
        { name: 'Beige', hex: '#d4c5b9' },
        { name: 'Grey', hex: '#9e9e9e' }
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      category: 'oversized',
      isNewArrival: true
    },
    {
      id: 'minimal-logo-tee',
      name: 'Minimal Logo Tee',
      price: 1199,
      description: 'A clean front logo print paired with an exceptionally soft off-white cotton fabric. Ideal for a sleek, understated style.',
      images: ['assets/category-women.png'],
      colors: [
        { name: 'Off-White', hex: '#f6f5f0' },
        { name: 'Pink', hex: '#e8c5c8' },
        { name: 'Light Pink', hex: '#f0dcdb' }
      ],
      sizes: ['S', 'M', 'L', 'XL'],
      category: 'women',
      isNewArrival: true
    },
    {
      id: 'future-is-ours-tee',
      name: 'Future Is Ours Tee',
      price: 1299,
      description: 'Embody the urban culture. Featuring detailed typography back art on a chocolate brown heavyweight cotton fabric.',
      images: ['assets/category-oversized.png'],
      colors: [
        { name: 'Brown', hex: '#5c4033' },
        { name: 'Black', hex: '#111111' },
        { name: 'Grey', hex: '#9e9e9e' }
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      category: 'oversized',
      isNewArrival: true
    },
    {
      id: 'grow-through-tee',
      name: 'Grow Through Tee',
      price: 1299,
      description: 'Grow through what you go through. Beautiful graphic floral arrangement detailed on premium off-white fabric.',
      images: ['assets/category-women.png'],
      colors: [
        { name: 'Beige', hex: '#ebd5b3' },
        { name: 'Green', hex: '#4f5d4a' },
        { name: 'Brown', hex: '#5c4033' }
      ],
      sizes: ['S', 'M', 'L', 'XL'],
      category: 'women',
      isNewArrival: true
    },
    {
      id: 'orbit-oversized-tee',
      name: 'Orbit Oversized Tee',
      price: 1299,
      description: 'Circular streetwear globe print on chest and back. Crafted in comfortable baggy style fit.',
      images: ['assets/category-men.png'],
      colors: [
        { name: 'Black', hex: '#111111' },
        { name: 'Grey', hex: '#9e9e9e' },
        { name: 'White', hex: '#ffffff' }
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      category: 'oversized',
      isNewArrival: true
    },
    {
      id: 'line-up-tee',
      name: 'Line Up Tee',
      price: 1199,
      description: 'Sleek graphic line streetwear elements, designed for everyday style and high-end street visual appeal.',
      images: ['assets/category-women.png'],
      colors: [
        { name: 'White', hex: '#ffffff' },
        { name: 'Black', hex: '#111111' },
        { name: 'Red', hex: '#b32d2e' }
      ],
      sizes: ['S', 'M', 'L', 'XL'],
      category: 'men',
      isNewArrival: true
    },
    {
      id: 'let-it-grow-tee',
      name: 'Let It Grow Tee',
      price: 1249,
      description: 'Plant-based street artwork in off-green screen print on premium black cotton. Standard fit for comfort and durability.',
      images: ['assets/category-men.png'],
      colors: [
        { name: 'Black', hex: '#111111' },
        { name: 'Beige', hex: '#ebd5b3' },
        { name: 'Brown', hex: '#5c4033' }
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      category: 'men',
      isBestSeller: true
    },
    {
      id: 'rebel-soul-tee',
      name: 'Rebel Soul Tee',
      price: 1299,
      description: 'Express your inner soul. High-quality print detailing with vintage aesthetic elements on dark brown base.',
      images: ['assets/category-oversized.png'],
      colors: [
        { name: 'Brown', hex: '#5c4033' },
        { name: 'Black', hex: '#111111' },
        { name: 'Grey', hex: '#9e9e9e' }
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      category: 'men',
      isBestSeller: true
    },
    {
      id: 'botanical-oversized-tee',
      name: 'Botanical Oversized Tee',
      price: 1299,
      description: 'Relaxed oversized fit featuring classic line botanic graphic design on front pocket and full back.',
      images: ['assets/category-women.png'],
      colors: [
        { name: 'Beige', hex: '#ebd5b3' },
        { name: 'Green', hex: '#4f5d4a' },
        { name: 'Off-White', hex: '#f6f5f0' }
      ],
      sizes: ['S', 'M', 'L', 'XL'],
      category: 'oversized',
      isBestSeller: true
    },
    {
      id: 'globe-oversized-tee',
      name: 'Globe Oversized Tee',
      price: 1299,
      description: 'LIT classic globe typography and graphic on front and back. Loose style silhouette for ultimate streetwear aesthetic.',
      images: ['assets/category-women.png'],
      colors: [
        { name: 'White', hex: '#ffffff' },
        { name: 'Black', hex: '#111111' },
        { name: 'Pink', hex: '#e8c5c8' }
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      category: 'oversized',
      isBestSeller: true
    },
    {
      id: 'signature-logo-tee',
      name: 'Signature Logo Tee',
      price: 1199,
      description: 'Clean typographic branding across the chest. Ideal daily essential wear made of 100% luxury long-staple cotton.',
      images: ['assets/category-men.png'],
      colors: [
        { name: 'Black', hex: '#111111' },
        { name: 'Beige', hex: '#ebd5b3' },
        { name: 'Grey', hex: '#9e9e9e' }
      ],
      sizes: ['S', 'M', 'L', 'XL'],
      category: 'men',
      isBestSeller: true
    },
    {
      id: 'graphic-back-tee',
      name: 'Graphic Back Tee',
      price: 1299,
      description: 'Featuring a bold full-back illustrative print representing urban street vibes, set on a premium dark brown base.',
      images: ['assets/category-oversized.png'],
      colors: [
        { name: 'Brown', hex: '#5c4033' },
        { name: 'Black', hex: '#111111' },
        { name: 'Grey', hex: '#9e9e9e' }
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      category: 'men',
      isBestSeller: true
    },
    {
      id: 'lit-baseball-cap',
      name: 'LIT Baseball Cap',
      price: 799,
      description: 'Complete your streetwear fit with our premium cotton twill baseball cap. Embroidered LIT branding on front, adjustable strap.',
      images: ['assets/category-accessories.png'],
      colors: [
        { name: 'Black', hex: '#111111' }
      ],
      sizes: ['One Size'],
      category: 'accessories',
      isBestSeller: true,
      isNewArrival: true
    }
  ];

  constructor() {}

  getProducts(): Observable<Product[]> {
    return of(this.products);
  }

  getProductById(id: string): Observable<Product | undefined> {
    const product = this.products.find(p => p.id === id);
    return of(product);
  }

  getNewArrivals(): Observable<Product[]> {
    return of(this.products.filter(p => p.isNewArrival));
  }

  getBestSellers(): Observable<Product[]> {
    return of(this.products.filter(p => p.isBestSeller));
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    if (category === 'all') {
      return of(this.products);
    }
    if (category === 'new-drops') {
      return of(this.products.filter(p => p.isNewArrival));
    }
    return of(this.products.filter(p => p.category === category));
  }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Slide {
  subtitle: string;
  titlePart1: string;
  titlePart2: string;
  description: string;
  image: string;
  link: string;
}

@Component({
  selector: 'app-hero-carousel',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './hero-carousel.component.html',
  styleUrl: './hero-carousel.component.css'
})
export class HeroCarouselComponent implements OnInit, OnDestroy {
  slides: Slide[] = [
    {
      subtitle: 'NEW DROP',
      titlePart1: 'LIVE IN',
      titlePart2: 'TREND',
      description: 'Streetwear for the bold. Designed for everyday.',
      image: 'assets/hero-banner.jpeg',
      link: '/products?category=new-drops'
    },
    {
      subtitle: 'PREMIUM QUALITY',
      titlePart1: 'STREET',
      titlePart2: 'ESSENTIALS',
      description: 'Uncompromising comfort. Premium heavyweight fabrics.',
      image: 'assets/category-men.jpeg',
      link: '/products?category=oversized'
    },
    {
      subtitle: 'SUMMER VIBES',
      titlePart1: 'BOTANICAL',
      titlePart2: 'OVERSIZED',
      description: 'Find your unique nature. Graphic tees for any fit.',
      image: 'assets/category-women.jpeg',
      link: '/products?category=women'
    }
  ];

  currentIndex = 0;
  private intervalId: any;

  ngOnInit() {
    this.startAutoPlay();
  }

  ngOnDestroy() {
    this.stopAutoPlay();
  }

  startAutoPlay() {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 6000); // Change slide every 6 seconds
  }

  stopAutoPlay() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  prevSlide() {
    this.currentIndex = (this.currentIndex === 0) ? this.slides.length - 1 : this.currentIndex - 1;
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex === this.slides.length - 1) ? 0 : this.currentIndex + 1;
  }

  setSlide(index: number) {
    this.currentIndex = index;
  }
}

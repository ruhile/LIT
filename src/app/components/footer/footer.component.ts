import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  email = '';
  subscriptionSuccess = false;
  subscriptionError = false;

  subscribeNewsletter() {
    if (!this.email || !this.email.includes('@')) {
      this.subscriptionError = true;
      this.subscriptionSuccess = false;
      setTimeout(() => this.subscriptionError = false, 3000);
      return;
    }
    
    // Simulate API call
    this.subscriptionSuccess = true;
    this.subscriptionError = false;
    this.email = '';
    
    setTimeout(() => {
      this.subscriptionSuccess = false;
    }, 4000);
  }
}

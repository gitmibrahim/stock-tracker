import { Component, OnDestroy, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockCardComponent } from './components/stock-card/stock-card.component';
import { StockService } from './services/stock.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, StockCardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnDestroy {
  isMobile = signal<boolean>(window.innerWidth <= 600);
  readonly stocks = computed(() => this.stockService.stocks());
  readonly isLoading = computed(() => this.stockService.isLoading());

  constructor(private stockService: StockService) {
    // Effect for handling resize events
    effect(() => {
      const handleResize = () => {
        this.isMobile.set(window.innerWidth <= 600);
      };
      
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    });
  }

  ngOnDestroy(): void {
    this.stockService.cleanup();
  }
}


import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockCardComponent } from './components/stock-card/stock-card.component';
import { StockService } from './services/stock.service';
import { Stock } from './models/stock.interface';
import { Observable, combineLatest } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, StockCardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnDestroy {
  stocks: Observable<Stock[]>;
  isMobile = window.innerWidth <= 600;
  private resizeListener: () => void;

  constructor(private stockService: StockService) {
    this.stocks = combineLatest(
      ['AAPL', 'GOOGL', 'MSFT', 'TSLA'].map(symbol =>
        this.stockService.getStock(symbol)
      )
    );

    this.resizeListener = () => {
      this.isMobile = window.innerWidth <= 600;
    };
    window.addEventListener('resize', this.resizeListener);
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.resizeListener);
    this.stockService.cleanup();
  }
}

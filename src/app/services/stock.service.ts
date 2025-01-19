import { Injectable, signal, computed } from '@angular/core';
import { interval } from 'rxjs';
import { Stock } from '../models/stock.interface';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private readonly symbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA'];
  private mockWebSocket: any;
  
  // Convert to signals
  private stocksMap = signal<Map<string, Stock>>(new Map());
  private isLoadingSignal = signal<boolean>(true);
  
  // Computed values
  readonly stocks = computed(() => Array.from(this.stocksMap().values()));
  readonly isLoading = computed(() => this.isLoadingSignal());

  constructor() {
    this.initializeStocks();
    this.startMockWebSocket();
  }

  private initializeStocks(): void {
    const initialStocks = new Map<string, Stock>();
    this.symbols.forEach(symbol => {
      const initialStock: Stock = {
        symbol,
        price: this.getRandomPrice(100, 1000),
        change: 0,
        changePercent: 0,
        lastTrade: new Date(),
        volume: Math.floor(Math.random() * 10000),
        isEnabled: true,
        dailyHigh: 0,
        dailyLow: 0,
        weekHigh52: 0,
        weekLow52: 0
      };
      initialStocks.set(symbol, initialStock);
    });
    this.stocksMap.set(initialStocks);
  }

  private startMockWebSocket(): void {
    let isFirstIteration = true;
    this.mockWebSocket = interval(2000).subscribe(() => {
      const currentStocks = new Map(this.stocksMap());
      
      currentStocks.forEach((stock, symbol) => {
        if (stock.isEnabled) {
          const initialPrice = stock.price;
          const newPrice = this.getRandomPrice(initialPrice * 0.95, initialPrice * 1.05);
          const change = newPrice - initialPrice;
          const changePercent = (change / initialPrice) * 100;

          currentStocks.set(symbol, {
            ...stock,
            price: newPrice,
            change: Number(change.toFixed(2)),
            changePercent: Number(changePercent.toFixed(2)),
            lastTrade: new Date(),
            volume: Math.floor(Math.random() * 10000),
            dailyHigh: Math.max(stock.dailyHigh || newPrice, newPrice),
            dailyLow: stock.dailyLow === 0 ? newPrice : Math.min(stock.dailyLow, newPrice),
            weekHigh52: Math.max(stock.weekHigh52 || newPrice, newPrice),
            weekLow52: stock.weekLow52 === 0 ? newPrice : Math.min(stock.weekLow52, newPrice)
          });
        }
      });

      this.stocksMap.set(currentStocks);
      
      if (isFirstIteration) {
        this.isLoadingSignal.set(false);
        isFirstIteration = false;
      }
    });
  }

  private getRandomPrice(min: number, max: number): number {
    return Number((Math.random() * (max - min) + min).toFixed(2));
  }

  getStock(symbol: string): Stock | undefined {
    return this.stocksMap().get(symbol);
  }

  toggleStock(symbol: string): void {
    const currentStocks = new Map(this.stocksMap());
    const stock = currentStocks.get(symbol);
    
    if (stock) {
      currentStocks.set(symbol, {
        ...stock,
        isEnabled: !stock.isEnabled
      });
      this.stocksMap.set(currentStocks);
    }
  }

  cleanup(): void {
    if (this.mockWebSocket) {
      this.mockWebSocket.unsubscribe();
    }
  }
}

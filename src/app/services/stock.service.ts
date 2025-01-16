import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, interval } from 'rxjs';
import { map } from 'rxjs/operators';
import { Stock } from '../models/stock.interface';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private stocks: Map<string, BehaviorSubject<Stock>> = new Map();
  private readonly symbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA'];
  private mockWebSocket: any;

  constructor() {
    this.initializeStocks();
    this.startMockWebSocket();
  }

  private initializeStocks(): void {
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
      this.stocks.set(symbol, new BehaviorSubject<Stock>(initialStock));
    });
  }

  private startMockWebSocket(): void {
    this.mockWebSocket = interval(2000).subscribe(() => {
      this.stocks.forEach((stockSubject, symbol) => {
        if (stockSubject.value.isEnabled) {
          const currentStock = stockSubject.value;
          const initialPrice = currentStock.price;
          const newPrice = this.getRandomPrice(initialPrice * 0.95, initialPrice * 1.05);
          const change = newPrice - initialPrice;
          const changePercent = (change / initialPrice) * 100;

          const updatedStock: Stock = {
            ...currentStock,
            price: newPrice,
            change: Number(change.toFixed(2)),
            changePercent: Number(changePercent.toFixed(2)),
            lastTrade: new Date(),
            volume: Math.floor(Math.random() * 10000),
            dailyHigh: Math.max(currentStock.dailyHigh || newPrice, newPrice),
            dailyLow: currentStock.dailyLow === 0 ? newPrice : Math.min(currentStock.dailyLow, newPrice),
            weekHigh52: Math.max(currentStock.weekHigh52 || newPrice, newPrice),
            weekLow52: currentStock.weekLow52 === 0 ? newPrice : Math.min(currentStock.weekLow52, newPrice)
          };

          stockSubject.next(updatedStock);
        }
      });
    });
  }

  private getRandomPrice(min: number, max: number): number {
    return Number((Math.random() * (max - min) + min).toFixed(2));
  }

  getStock(symbol: string): Observable<Stock> {
    const stock = this.stocks.get(symbol);
    if (!stock) {
      throw new Error(`Stock ${symbol} not found`);
    }
    return stock.asObservable();
  }

  toggleStock(symbol: string): void {
    const stock = this.stocks.get(symbol);
    if (stock) {
      const currentStock = stock.value;
      stock.next({
        ...currentStock,
        isEnabled: !currentStock.isEnabled
      });
    }
  }

  cleanup(): void {
    if (this.mockWebSocket) {
      this.mockWebSocket.unsubscribe();
    }
    this.stocks.forEach(subject => subject.complete());
  }
}

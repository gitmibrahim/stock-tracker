import { TestBed, fakeAsync, tick, discardPeriodicTasks } from '@angular/core/testing';
import { StockService } from './stock.service';
import { Stock } from '../models/stock.interface';
import { firstValueFrom } from 'rxjs';

describe('StockService', () => {
  let service: StockService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StockService]
    });
    service = TestBed.inject(StockService);
  });

  afterEach(() => {
    service.cleanup();
  });

  describe('Initialization', () => {
    it('should create the service', () => {
      expect(service).toBeTruthy();
    });

    it('should initialize default stocks', async () => {
      const symbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA'];
      
      for (const symbol of symbols) {
        const stock = await firstValueFrom(service.getStock(symbol));
        expect(stock).toBeTruthy();
        expect(stock.symbol).toBe(symbol);
        expect(stock.isEnabled).toBeTrue();
      }
    });
  });

  describe('getStock', () => {
    it('should throw error for invalid symbol', () => {
      expect(() => service.getStock('INVALID'))
        .toThrowError('Stock INVALID not found');
    });
  });

  describe('Stock Updates', () => {
    it('should not update disabled stocks', fakeAsync(() => {
      const symbol = 'AAPL';
      let values: Stock[] = [];

      const subscription = service.getStock(symbol).subscribe(stock => {
        values.push({ ...stock });
      });

      // Get initial value
      const initialPrice = values[0].price;

      // Disable the stock
      service.toggleStock(symbol);

      // Wait for potential updates
      tick(2100);

      // Should have 2 values: initial and toggle update
      expect(values.length).toBe(2);
      expect(values[1].price).toBe(initialPrice);
      expect(values[1].isEnabled).toBeFalse();

      subscription.unsubscribe();
      discardPeriodicTasks();
    }));
  });

  describe('toggleStock', () => {
    it('should toggle stock enabled status', async () => {
      const symbol = 'AAPL';
      
      const initialStock = await firstValueFrom(service.getStock(symbol));
      expect(initialStock.isEnabled).toBeTrue();

      service.toggleStock(symbol);

      const updatedStock = await firstValueFrom(service.getStock(symbol));
      expect(updatedStock.isEnabled).toBeFalse();
    });
  });

  describe('cleanup', () => {
    it('should stop updates after cleanup', fakeAsync(() => {
      const symbol = 'AAPL';
      let updateCount = 0;

      const subscription = service.getStock(symbol).subscribe(() => {
        updateCount++;
      });

      // Initial value
      expect(updateCount).toBe(1);

      tick(2100);
      const countBeforeCleanup = updateCount;

      service.cleanup();
      tick(2100);

      expect(updateCount).toBe(countBeforeCleanup);

      subscription.unsubscribe();
      discardPeriodicTasks();
    }));
  });
});

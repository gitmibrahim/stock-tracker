import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { StockService } from './services/stock.service';
import { StockCardComponent } from './components/stock-card/stock-card.component';
import { BehaviorSubject, of } from 'rxjs';
import { Stock } from './models/stock.interface';
import { By } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let stockService: jasmine.SpyObj<StockService>;
  let stockSubjects: Map<string, BehaviorSubject<Stock>>;

  const createMockStock = (symbol: string, price: number): Stock => ({
    symbol,
    price,
    change: 0,
    changePercent: 0,
    lastTrade: new Date(),
    volume: 1000000,
    isEnabled: true,
    dailyHigh: price + 1,
    dailyLow: price - 1,
    weekHigh52: price + 5,
    weekLow52: price - 5
  });

  const mockStocks: Stock[] = [
    createMockStock('AAPL', 150.50),
    createMockStock('GOOGL', 2800.75),
    createMockStock('MSFT', 300.25),
    createMockStock('TSLA', 950.00)
  ];

  beforeEach(async () => {
    stockSubjects = new Map(
      mockStocks.map(stock => [
        stock.symbol,
        new BehaviorSubject<Stock>(stock)
      ])
    );

    stockService = jasmine.createSpyObj('StockService', ['getStock', 'cleanup']);
    stockService.getStock.and.callFake((symbol: string) => {
      const subject = stockSubjects.get(symbol);
      if (!subject) {
        throw new Error(`Stock ${symbol} not found`);
      }
      return subject.asObservable();
    });

    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        StockCardComponent,
        MatCardModule,
        MatSlideToggleModule
      ],
      providers: [
        { provide: StockService, useValue: stockService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    stockSubjects.forEach(subject => subject.complete());
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display stock-tracker title', () => {
    const titleElement = fixture.debugElement.query(By.css('h1'));
    expect(titleElement.nativeElement.textContent).toContain('Stock Tracker');
  });

  it('should render stock cards for each stock', fakeAsync(() => {
    tick();
    fixture.detectChanges();

    const stockCards = fixture.debugElement.queryAll(By.directive(StockCardComponent));
    expect(stockCards.length).toBe(mockStocks.length);
  }));

  it('should pass correct stock data to stock cards', fakeAsync(() => {
    tick();
    fixture.detectChanges();

    const stockCards = fixture.debugElement.queryAll(By.directive(StockCardComponent));
    stockCards.forEach((card) => {
      const stockCardComponent = card.componentInstance as StockCardComponent;
      const mockStock = mockStocks.find(s => s.symbol === stockCardComponent.stock?.symbol);
      expect(stockCardComponent.stock).toBeTruthy();
      expect(stockCardComponent.stock?.symbol).toBe(mockStock?.symbol);
      expect(stockCardComponent.stock?.price).toBe(mockStock?.price);
    });
  }));

  it('should update stock cards when new stock data arrives', fakeAsync(() => {
    tick();
    fixture.detectChanges();

    const updatedStock = { ...mockStocks[0], price: 155.00 };
    stockSubjects.get('AAPL')?.next(updatedStock);
    
    tick();
    fixture.detectChanges();

    const stockCards = fixture.debugElement.queryAll(By.directive(StockCardComponent));
    const appleCard = stockCards.find(card => 
      (card.componentInstance as StockCardComponent).stock?.symbol === 'AAPL'
    );
    expect((appleCard?.componentInstance as StockCardComponent).stock?.price)
      .toBe(155.00);
  }));

  it('should pass isMobile flag to stock cards', fakeAsync(() => {
    tick();
    fixture.detectChanges();

    component.isMobile = true;
    fixture.detectChanges();

    const stockCards = fixture.debugElement.queryAll(By.directive(StockCardComponent));
    stockCards.forEach(card => {
      const stockCardComponent = card.componentInstance as StockCardComponent;
      expect(stockCardComponent.isMobile).toBeTrue();
    });
  }));

  it('should clean up resources on destroy', fakeAsync(() => {
    const removeEventListenerSpy = spyOn(window, 'removeEventListener');
    
    component.ngOnDestroy();
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', component['resizeListener']);
    expect(stockService.cleanup).toHaveBeenCalled();
  }));

  it('should update isMobile on window resize', fakeAsync(() => {
    // Mock window.innerWidth
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 800
    });

    // Trigger resize event
    window.dispatchEvent(new Event('resize'));
    tick();
    expect(component.isMobile).toBeFalse();

    // Change window width and trigger resize again
    Object.defineProperty(window, 'innerWidth', { value: 400 });
    window.dispatchEvent(new Event('resize'));
    tick();
    expect(component.isMobile).toBeTrue();
  }));
});

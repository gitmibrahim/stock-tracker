import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StockCardComponent } from './stock-card.component';
import { StockService } from '../../services/stock.service';
import { Stock } from '../../models/stock.interface';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { By } from '@angular/platform-browser';

describe('StockCardComponent', () => {
  let component: StockCardComponent;
  let fixture: ComponentFixture<StockCardComponent>;
  let stockService: jasmine.SpyObj<StockService>;

  const mockStock: Stock = {
    symbol: 'AAPL',
    price: 150.50,
    change: 2.5,
    changePercent: 1.67,
    lastTrade: new Date(),
    volume: 1000000,
    isEnabled: true,
    dailyHigh: 152.00,
    dailyLow: 149.00,
    weekHigh52: 155.00,
    weekLow52: 145.00
  };

  beforeEach(async () => {
    stockService = jasmine.createSpyObj('StockService', ['toggleStock']);

    await TestBed.configureTestingModule({
      imports: [
        StockCardComponent,
        MatCardModule,
        MatSlideToggleModule
      ],
      providers: [
        { provide: StockService, useValue: stockService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StockCardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display stock information when stock input is provided', () => {
    component.stock = mockStock;
    fixture.detectChanges();

    const titleElement = fixture.debugElement.query(By.css('mat-card-title'));
    const priceElement = fixture.debugElement.query(By.css('mat-card-subtitle'));
    
    expect(titleElement.nativeElement.textContent).toContain('AAPL');
    expect(priceElement.nativeElement.textContent).toContain('150.50');
  });

  it('should apply positive class when change is positive', () => {
    component.stock = { ...mockStock, change: 2.5 };
    fixture.detectChanges();

    const cardElement = fixture.debugElement.query(By.css('mat-card'));
    expect(cardElement.classes['positive']).toBeTrue();
    expect(cardElement.classes['negative']).toBeFalsy();
  });

  it('should apply negative class when change is negative', () => {
    component.stock = { ...mockStock, change: -2.5 };
    fixture.detectChanges();

    const cardElement = fixture.debugElement.query(By.css('mat-card'));
    expect(cardElement.classes['negative']).toBeTrue();
    expect(cardElement.classes['positive']).toBeFalsy();
  });

  it('should call toggleStock when slide toggle is clicked', () => {
    component.stock = mockStock;
    fixture.detectChanges();

    component.toggleStock();
    expect(stockService.toggleStock).toHaveBeenCalledWith('AAPL');
  });

  it('should not show 52-week info when isMobile is true', () => {
    component.stock = mockStock;
    component.isMobile = true;
    fixture.detectChanges();

    const priceInfoElement = fixture.debugElement.query(By.css('.price-info'));
    expect(priceInfoElement).toBeFalsy();
  });

  it('should show 52-week info when isMobile is false', () => {
    component.stock = mockStock;
    component.isMobile = false;
    fixture.detectChanges();

    const priceInfoElement = fixture.debugElement.query(By.css('.price-info'));
    expect(priceInfoElement).toBeTruthy();
  });

  it('should handle undefined stock gracefully', () => {
    component.stock = undefined;
    fixture.detectChanges();
    
    const cardElement = fixture.debugElement.query(By.css('mat-card'));
    expect(cardElement).toBeTruthy(); // Card should still render
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});

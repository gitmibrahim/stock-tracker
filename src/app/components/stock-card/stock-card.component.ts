import { Component, Input, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { StockService } from '../../services/stock.service';
import { Stock } from '../../models/stock.interface';

@Component({
  selector: 'app-stock-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, MatCardModule, MatSlideToggleModule],
  templateUrl: './stock-card.component.html',
  styleUrls: ['./stock-card.component.scss'],
  animations: [
    trigger('priceChange', [
      transition('* => *', [
        style({ transform: 'scale(1.1)', color: '#4CAF50' }),
        animate('300ms ease-out', style({ transform: 'scale(1)', color: '*' }))
      ])
    ]),
    trigger('cardState', [
      state('enabled', style({
        opacity: 1,
        transform: 'scale(1)'
      })),
      state('disabled', style({
        opacity: 0.8,
        transform: 'scale(0.98)'
      })),
      transition('enabled <=> disabled', [
        animate('300ms ease-in-out')
      ])
    ])
  ]
})
export class StockCardComponent {
  private stockSignal = signal<Stock | null>(null);
  
  @Input() set stock(value: Stock) {
    this.stockSignal.set(value);
  }
  
  @Input() set isMobile(value: boolean) {
    this.isMobileSignal.set(value);
  }
  
  private isMobileSignal = signal<boolean>(false);

  // Computed values
  readonly symbol = computed(() => this.stockSignal()?.symbol);
  readonly price = computed(() => this.stockSignal()?.price);
  readonly change = computed(() => this.stockSignal()?.change || 0);
  readonly changePercent = computed(() => this.stockSignal()?.changePercent || 0);
  readonly lastTrade = computed(() => this.stockSignal()?.lastTrade);
  readonly volume = computed(() => this.stockSignal()?.volume);
  readonly weekHigh52 = computed(() => this.stockSignal()?.weekHigh52);
  readonly weekLow52 = computed(() => this.stockSignal()?.weekLow52);
  readonly isPositive = computed(() => (this.stockSignal()?.change || 0) >= 0);
  readonly isEnabled = computed(() => this.stockSignal()?.isEnabled || false);
  readonly cardState = computed(() => this.isEnabled() ? 'enabled' : 'disabled');
  readonly isMobileValue = computed(() => this.isMobileSignal());

  constructor(private stockService: StockService) {}

  toggleStock(): void {
    if (this.stockSignal()) {
      this.stockService.toggleStock(this.stockSignal()!.symbol);
    }
  }
}

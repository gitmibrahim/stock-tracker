import { Component, Input, Output, EventEmitter, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Stock } from '../../models/stock.interface';
import { StockService } from '../../services/stock.service';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { trigger, state, style, transition, animate } from '@angular/animations';

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
  @Input() stock?: Stock;
  @Input() isMobile = false;
  @Output() toggle = new EventEmitter<void>();

  previousPrice?: number;

  constructor(private stockService: StockService) {}

  ngOnChanges() {
    if (this.stock?.price !== this.previousPrice) {
      this.previousPrice = this.stock?.price;
    }
  }

  toggleStock() {
    this.stockService.toggleStock(this.stock!.symbol);
    this.toggle.emit();
  }

  @HostBinding('@cardState') get cardState() {
    return this.stock?.isEnabled ? 'enabled' : 'disabled';
  }
}

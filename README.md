# Stock Tracker

A modern, real-time stock tracking application built with Angular 19, featuring animated stock cards and live price updates.

## Features

- Real-time stock price updates
- Animated stock cards with modern UI
- Responsive design for mobile and desktop
- Custom toggle switches with smooth animations
- Enable/disable individual stock tracking
- Performance optimized with OnPush change detection

## Technical Stack

- **Angular**: 19.0.0
- **TypeScript**: 5.6.2
- **RxJS**: 7.8.0
- **Angular Material**: 19.0.5
- **Node.js**: 18.13.0 or higher

## Dependencies

```json
{
  "@angular/animations": "^19.0.0",
  "@angular/common": "^19.0.0",
  "@angular/compiler": "^19.0.0",
  "@angular/core": "^19.0.0",
  "@angular/forms": "^19.0.0",
  "@angular/material": "^19.0.5",
  "@angular/platform-browser": "^19.0.0",
  "@angular/platform-browser-dynamic": "^19.0.0",
  "@angular/router": "^19.0.0",
  "rxjs": "~7.8.0",
  "tslib": "^2.3.0",
  "zone.js": "~0.15.0"
}
```

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/stock-tracker.git
   cd stock-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   ng serve
   ```

4. **Open your browser**
   Navigate to `http://localhost:4200/`

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   └── stock-card/
│   │       ├── stock-card.component.ts
│   │       ├── stock-card.component.html
│   │       ├── stock-card.component.scss
│   │       └── stock-card.component.spec.ts
│   ├── services/
│   │   ├── stock.service.ts
│   │   └── stock.service.spec.ts
│   ├── models/
│   │   └── stock.interface.ts
│   ├── app.component.ts
│   └── app.module.ts
└── assets/
```

## Features in Detail

### Stock Service
- Manages real-time stock data using RxJS BehaviorSubject
- Simulates WebSocket updates every 2 seconds
- Handles stock enabling/disabling
- Maintains stock price history

### Stock Card Component
- Displays individual stock information
- Features smooth animations for price updates
- Custom toggle switch for enabling/disabling stocks
- Responsive design with mobile optimization
- Uses OnPush change detection for better performance

## Testing

The application includes comprehensive unit tests for both the StockService and components. Run the tests with:

```bash
ng test
```

## Performance Considerations

- Uses OnPush change detection strategy
- Optimized animations using hardware acceleration
- Efficient RxJS operators for data handling
- Proper cleanup of subscriptions and event listeners

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Edge (latest)
- Safari (latest)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

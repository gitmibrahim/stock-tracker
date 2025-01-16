export interface Stock {
    symbol: string;
    price: number;
    change: number;
    changePercent: number;
    lastTrade: Date;
    volume: number;
    isEnabled: boolean;
    dailyHigh: number;
    dailyLow: number;
    weekHigh52: number;
    weekLow52: number;
}

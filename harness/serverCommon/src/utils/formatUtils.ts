export class FormatUtils {
  static formatMoney(amount: number): string {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  }
  static formatNumber(amount: number): string {
    return amount.toLocaleString('en-US', {});
  }
}

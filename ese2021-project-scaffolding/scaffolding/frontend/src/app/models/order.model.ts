export class Order {
  constructor(
    public orderId: number,
    public userId: number,
    public firstName: string,
    public lastName: string,
    public address: string,
    public paymentMethod: number,
    public deliveryStatus: string,
    public productId: number,
  ) {}
}

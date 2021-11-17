
export class Order {
  constructor(
    public orderId: number,
    public userId: number,
    public firstName: string,
    public lastName: string,
    public address: string,
    public paymentMethod: number,
    public deliveryStatus: number,
    public productId: number,
  ) {}
}

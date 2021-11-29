import {Product} from "./product.model";

/**
 * This is the Model for the Orders the deliveryStatus is a Sring with 3 fix Srings
 * pending, shipped/delivered and cancelled.
 * The paymentMethode is a number that we could add more paymentMethodes 0 is the "Payment via invoice"
 *
 */
export class Order {
  constructor(
    public orderId: number,
    public userId: number,
    public firstName: string,
    public lastName: string,
    public address: string,
    public paymentMethod: number,
    public deliveryStatus: string,
    public product: Product,
  ) {}
}

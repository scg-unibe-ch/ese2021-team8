import { Product} from './product.model';

export class ShoppingCart {
  
  constructor(
    public cartId: number,
    public userId: number,
    public deliveryStatus: number,
    public products: Product[]
  ) {}
}

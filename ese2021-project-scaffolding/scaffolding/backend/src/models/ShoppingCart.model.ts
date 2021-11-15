import {
    Optional,
    Model,
    Sequelize,
    DataTypes,
} from 'sequelize';
import { Product } from './product.model';
import { Order } from './order.model';

export interface ShoppingCartAttributes {
    cartId: number;
    orderId: number;
    productId: number;
}

export interface ShoppingCartCreationAttributes extends Optional<ShoppingCartAttributes, 'cartId'> { }

export class ShoppingCart extends Model<ShoppingCartAttributes, ShoppingCartCreationAttributes> implements ShoppingCartAttributes {

    cartId!: number;
    orderId!: number;
    productId!: number;

    public static initialize(sequelize: Sequelize) {
        ShoppingCart.init({
                cartId: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true
                },
                productId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: Product,
                        key: 'productId'
                    }
                },
                orderId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: Order,
                        key: 'orderId'
                    }
                }
            },
            {
                sequelize,
                tableName: 'shoppingCarts'
            }
        );
    }
}

import {
    Optional,
    Model,
    Sequelize,
    DataTypes,
} from 'sequelize';
import { User } from './user.model';
import { Product } from './product.model';

export interface OrderAttributes {
    orderId: number;
    userId: number;
    firstName: string;
    lastName: string;
    address: string;
    paymentMethod: number;
    deliveryStatus: number;
    productId: number;
}

export interface OrderCreationAttributes extends Optional<OrderAttributes, 'orderId'> { }

export class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {

    orderId!: number;
    userId!: number;
    firstName!: string;
    lastName!: string;
    address!: string;
    paymentMethod: number;
    deliveryStatus!: number;
    productId!: number;

    public static initialize(sequelize: Sequelize) {
        Order.init({
                orderId: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true
                },
                userId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: User,
                        key: 'userId'
                    }
                },
                firstName: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                lastName: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                address: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                paymentMethod: {
                    type: DataTypes.NUMBER,
                    allowNull: false
               },
                deliveryStatus: {
                    type: DataTypes.ENUM('pending', 'shipped/delivered', 'cancelled', 'unknown'),
                    defaultValue: 'pending',
                    allowNull: false
                },
                productId: {
                    type: DataTypes.INTEGER,
                    references: {
                        model: Product,
                        key: 'productId'
                    }
                }
            },
            {
                sequelize,
                tableName: 'orders'
            }
        );
    }
}

import {
    Optional,
    Model,
    Sequelize,
    DataTypes,
} from 'sequelize';
import { User } from './user.model';

export interface OrderAttributes {
    orderId: number;
    userId: number;
    deliveryStatus: number;
}

export interface OrderCreationAttributes extends Optional<OrderAttributes, 'orderId'> { }

export class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {

    orderId!: number;
    userId!: number;
    deliveryStatus!: number;

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
                deliveryStatus: {
                    type: DataTypes.INTEGER,
                    defaultValue: 0,
                    allowNull: false
                }
            },
            {
                sequelize,
                tableName: 'orders'
            }
        );
    }
}

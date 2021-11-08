import {
    Optional,
    Model,
    HasManyGetAssociationsMixin,
    HasManyAddAssociationMixin,
    Sequelize,
    DataTypes,
    Association
} from 'sequelize';
import { Product } from './Product.model'

export interface ShoppingCartAttributes {
    cartId: number;
    userId: number;
    deliveryStatus: number;
}

export interface ShoppingCartCreationAttributes extends Optional<ShoppingCartAttributes, 'userId'> { }

export class ShoppingCart extends Model<ShoppingCartAttributes, ShoppingCartCreationAttributes> implements ShoppingCartAttributes {

    public static associations: {
        products: Association<ShoppingCart, Product>
    };

    cartId!: number;
    userId!: number;
    deliveryStatus!: number;

    public getProducts!: HasManyGetAssociationsMixin<Product>;
    public addProductToCart!: HasManyAddAssociationMixin<Product, number>;

    /*Might be changed to private*/
    public products?: Product[];

    public static initialize(sequelize: Sequelize) {
        ShoppingCart.init({
                cartId: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true
                },
                userId: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                deliveryStatus: {
                    type: DataTypes.STRING,
                    defaultValue: 0,
                    allowNull: false
                }
            },
            {
                sequelize,
                tableName: 'shoppingCarts'
            }
        );
    }
    /*Might change foreignKey because of association-type*/
    public static createAssociations() {
        ShoppingCart.hasMany(Product, {
            as: 'products',
            foreignKey: 'cartId'
        });
    }
}

import { Optional, Model, DataTypes, Sequelize} from 'sequelize';
import {Category} from './category.model';
import {ItemImage} from './itemImage.model';
import {ProductImage} from './productImage.model';

export interface ProductAttributes {
    productId: number;
    title: string;
    storeCategoryId: number;
    description: string;
    price: number;
    productImage: boolean;
}

export interface ProductCreationAttributes extends Optional<ProductAttributes, 'productId'> {}

export class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
    productId!: number;
    title!: string;
    storeCategoryId!: number;
    description!: string;
    price!: number;
    productImage!: boolean;

    public static initialize(sequelize: Sequelize) {
        Product.init({
            productId: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false
            },
            storeCategoryId: {
                type: DataTypes.INTEGER,
                references: {
                    model: Category,
                    key: 'categoryId'
                }
            },
            description: {
                type: DataTypes.STRING,
                allowNull: false
            },
            price: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            productImage: {
                type: DataTypes.BOOLEAN,
                allowNull: true
            }

        },
        {
            tableName: 'product', sequelize
        }
        );
    }

    public static createAssociations() {
        Product.hasOne(ProductImage, {
            as: 'images',
            foreignKey: 'productId'
        });
    }
}




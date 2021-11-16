import { Optional, Model, DataTypes, Sequelize } from 'sequelize';

export interface ShopCategoryAttributes {
    shopCategoryId: number;
    shopCategoryName: string;
}

export interface ShopCategoryCreationAttributes extends Optional<ShopCategoryAttributes, 'shopCategoryId'> {}

export class ShopCategory extends Model<ShopCategoryAttributes, ShopCategoryCreationAttributes> implements ShopCategoryAttributes {
    shopCategoryId!: number;
    shopCategoryName!: string;

    public static initialize(sequelize: Sequelize) {
        ShopCategory.init({
            shopCategoryId: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            shopCategoryName: {
                type: DataTypes.STRING,
                allowNull: false
            }
        },
            {
                sequelize,
                tableName: 'shopCategories'
            }
            );
    }
}

import { Optional, Model, DataTypes, Sequelize } from 'sequelize';

export interface CategoryAttributes {
    categoryId: number;
    categoryName: string;
}

export interface CategoryCreationAttributes extends Optional<CategoryAttributes, 'categoryId'> {}

export class Category extends Model<CategoryAttributes, CategoryCreationAttributes> implements CategoryAttributes {
    categoryId!: number;
    categoryName!: string;

    public static initialize(sequelize: Sequelize) {
        Category.init({
            categoryId: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            categoryName: {
                type: DataTypes.STRING,
                allowNull: false
            }
        },
            {
                sequelize,
                tableName: 'categories'
            }
            );
    }
}

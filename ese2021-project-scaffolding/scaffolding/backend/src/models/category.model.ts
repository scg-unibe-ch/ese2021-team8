import { Optional, Model, DataTypes, Sequelize, Association } from 'sequelize';
import {TodoList} from './todolist.model';

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
    // Posts belong to a category, tbd: if Todolist is not post, change it
    public static createAssociations() {
        Category.hasMany(TodoList, {
            as: 'elements',
            foreignKey: 'categoryId'
        });
    }
}

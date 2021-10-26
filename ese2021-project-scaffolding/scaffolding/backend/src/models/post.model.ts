import { Optional, Model, DataTypes, Sequelize, Association } from 'sequelize';
import {Category} from './category.model';
import { User } from './user.model';

export interface PostAttributes {
    postId: number;
    title: string;
    categoryId: number;
    content: string;
    creatorId: number;
    date: Date;
}

export interface PostCreationAttributes extends Optional<PostAttributes, 'postId'> {}

export class Post extends Model<PostAttributes, PostCreationAttributes> implements PostAttributes {
    postId!: number;
    title!: string;
    categoryId!: number;
    content!: string;
    creatorId!: number;
    date!: Date;

    public static initialize(sequelize: Sequelize) {
        Post.init({
            postId: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false
            },
            categoryId: {
                type: DataTypes.INTEGER,
                references: {
                    model: Category,
                    key: 'categoryId'
                }
            },
            content: {
                type: DataTypes.STRING,
                allowNull: false
            },
            creatorId: {
                type: DataTypes.INTEGER,
                references: {
                    model: User,
                    key: 'userId'
                }
            },
            date: {
                type: DataTypes.DATE,
                allowNull: false
            }

        },
        {
            tableName: 'posts', sequelize
        }
        );
    }
}




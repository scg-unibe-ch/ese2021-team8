import { Optional, Model, DataTypes, Sequelize, Association } from 'sequelize';
import { User } from './user.model';
import { Category } from './category.model';

export interface PostAttributes {
    postId: number;
    title: string;
    category: Category;
    content: string;
    creator: User;
    date: Date;
}

export interface PostCreationAttributes extends Optional<PostAttributes, 'postId'> {}

export class Post extends Model<PostAttributes, PostCreationAttributes> implements PostAttributes {
    postId!: number;
    title!: string;
    category: Category;
    content!: string;
    creator: User;
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
            category: {
                type: DataTypes.STRING,
            },
            content: {
                type: DataTypes.STRING,
                allowNull: false
            },
            creator: {
                type: DataTypes.STRING,
            },
            date: {
                type: DataTypes.DATEONLY,
                allowNull: false
            }

        },
        {
            sequelize,
            tableName: 'posts'
        }
        );
    }
}




import { Optional, Model, DataTypes, Sequelize} from 'sequelize';
import {Category} from './category.model';
import { User } from './user.model';
import {ItemImage} from './itemImage.model';

export interface PostAttributes {
    postId: number;
    title: string;
    categoryId: number;
    content: string;
    creatorId: number;
    date: Date;
    votes: number;
    itemImage: boolean;
}

export interface PostCreationAttributes extends Optional<PostAttributes, 'postId'> {}

export class Post extends Model<PostAttributes, PostCreationAttributes> implements PostAttributes {
    postId!: number;
    title!: string;
    categoryId!: number;
    content!: string;
    creatorId!: number;
    date!: Date;
    votes!: number;
    itemImage!: boolean;

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
            },
            votes: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            itemImage: {
                type: DataTypes.BOOLEAN,
                allowNull: true
            }

        },
        {
            tableName: 'posts', sequelize
        }
        );
    }

    public static createAssociations() {
        Post.hasOne(ItemImage, {
            as: 'images',
            foreignKey: 'postId'
        });
    }
}




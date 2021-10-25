import { Optional, Model, DataTypes, Sequelize, Association } from 'sequelize';

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
    categoryId: number;
    content!: string;
    creatorId: number;
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
            },
            content: {
                type: DataTypes.STRING,
                allowNull: false
            },
            creatorId: {
                type: DataTypes.INTEGER,
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




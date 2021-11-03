import {Model, DataTypes, Sequelize, Optional} from 'sequelize';
import {Post, PostAttributes, PostCreationAttributes} from './post.model';
import { User } from './user.model';

export interface LikeAttributes {
    likeId: number;
    postId: number;
    userId: number;
    upvoted: boolean;
    downvoted: boolean;
}

export interface LikeCreationAttributes extends Optional<LikeAttributes, 'likeId'> { }

export class Like extends Model<LikeAttributes, LikeCreationAttributes> implements LikeAttributes {
    likeId!: number;
    postId!: number;
    userId!: number;
    upvoted: boolean;
    downvoted: boolean;


public static initialize(sequelize: Sequelize) {
        Like.init({
                likeId: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true
                },
                postId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: Post,
                        key: 'postId'
                    }
                },
                userId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: User,
                        key: 'userId'
                    }
                },
                upvoted: {
                    type: DataTypes.BOOLEAN,
                    allowNull: true
                },
                downvoted: {
                    type: DataTypes.BOOLEAN,
                    allowNull: true
                }
            },
            {
                sequelize,
                tableName: 'likes'
            }
        );
    }

}

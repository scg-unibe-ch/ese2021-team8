import { Model, DataTypes, Sequelize } from 'sequelize';
import { Post } from './post.model';
import { User } from './user.model';

export interface LikeAttributes {
    likeId: number;
    postId: number;
    userId: number;
}

export class Like extends Model<LikeAttributes> implements LikeAttributes {
    likeId!: number;
    postId!: number;
    userId!: number;


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
                }
            },
            {
                sequelize,
                tableName: 'likes'
            }
        );
    }

}

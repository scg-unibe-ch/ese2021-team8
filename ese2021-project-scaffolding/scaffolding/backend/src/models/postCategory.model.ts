import { Optional, Model, DataTypes, Sequelize } from 'sequelize';

export interface PostCategoryAttributes {
    postCategoryId: number;
    postCategoryName: string;
}

export interface PostCategoryCreationAttributes extends Optional<PostCategoryAttributes, 'postCategoryId'> {}

export class PostCategory extends Model<PostCategoryAttributes, PostCategoryCreationAttributes> implements PostCategoryAttributes {
    postCategoryId!: number;
    postCategoryName!: string;

    public static initialize(sequelize: Sequelize) {
        PostCategory.init({
            postCategoryId: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            postCategoryName: {
                type: DataTypes.STRING,
                allowNull: false
            }
        },
            {
                sequelize,
                tableName: 'postCategories'
            }
            );
    }
}

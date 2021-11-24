import { Optional, Model, DataTypes, Sequelize, Association } from 'sequelize';
import { Post } from './post.model';

export interface ItemImageAttributes {
    imageId: number;
    fileName: string;
    postId: number;
}

export interface ItemCreationAttributes extends Optional<ItemImageAttributes, 'imageId'> { }

export class ItemImage extends Model<ItemImageAttributes, ItemCreationAttributes> implements ItemImageAttributes {
    public static associations: {
        product: Association<Post, ItemImage>;
    };

    imageId!: number;
    fileName!: string;
    postId!: number;

    public static initialize(sequelize: Sequelize) {
        ItemImage.init(
            {
                imageId: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true
                },
                fileName: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                postId: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                }
            },
            { tableName: 'itemImages', sequelize }
        );
    }

    public static createAssociations() {
        ItemImage.belongsTo(Post, {
            targetKey: 'postId',
            as: 'item',
            onDelete: 'cascade',
            foreignKey: 'postId'
        });
    }
}

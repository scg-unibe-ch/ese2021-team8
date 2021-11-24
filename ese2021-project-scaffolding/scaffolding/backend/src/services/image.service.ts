import {upload} from '../middlewares/fileFilter';
import {ItemImage, ItemImageAttributes} from '../models/itemImage.model';
import {MulterRequest} from '../models/multerRequest.model';
import {Post} from '../models/post.model';
import {Product} from '../models/product.model';
import {ProductImage, ProductImageAttributes} from '../models/productImage.model';

export class ImageService {

    public addImageToPost(req: MulterRequest): Promise<ItemImageAttributes> {
        return Post.findByPk(req.params.id)
            .then(found => {
                if (!found) {
                    return Promise.reject('Post not found!');
                } else {
                    return new Promise<ItemImageAttributes>((resolve, reject) => {
                        upload.single('image')(req, null, (error: any) => {
                            ItemImage.create({ fileName: req.file.filename, postId: found.postId })
                                .then(created => resolve(created))
                                .catch(() => reject('Could not upload image!'));
                        });
                    });
                }
            })
            .catch((err) => Promise.reject(err));
    }

    public addImageToProduct(req: MulterRequest): Promise<ProductImageAttributes> {
        return Product.findByPk(req.params.id)
            .then(found => {
                if (!found) {
                    return Promise.reject('Product not found!');
                } else {
                    return new Promise<ProductImageAttributes>((resolve, reject) => {
                        upload.single('image')(req, null, (error: any) => {
                            ProductImage.create({ fileName: req.file.filename, productId: found.productId })
                                .then(created => resolve(created))
                                .catch(() => reject('Could not upload image!'));
                        });
                    });
                }
            })
            .catch((err) => Promise.reject(err));
    }

    public getImageItem(imageId: number): Promise<ItemImage> {
        return ItemImage.findByPk(imageId)
            .then(image => {
                if (image) {
                    return Promise.resolve(image);
                } else {
                    return Promise.reject('image not found!');
                }
            })
            .catch(() => Promise.reject('could not fetch the image!'));
    }
/*
* Delete Image: method does not work yet
* */
    public removeImage(post: Post): Promise<ItemImage> {
        return ItemImage.findOne({where: {postId: post.postId }}).then( found => {
            if (!found) {
                return Promise.reject('Picture not found');
            } else {
                // tslint:disable-next-line:no-shadowed-variable
                const fs = require('fs');
                const path = './src/public/uploads/' + found.fileName;
                fs.unlink(path, (err) => {
                    if (err) {
                        return Promise.reject('Could not delete image');
                    }
                });
                return Promise.resolve(found);
            }
        });
    }
}

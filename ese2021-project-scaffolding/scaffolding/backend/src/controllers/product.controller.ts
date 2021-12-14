import express from 'express';
import { Router, Request, Response } from 'express';
import { Product } from '../models/product.model';
import {checkAdmin} from '../middlewares/checkAdmin';
import {MulterRequest} from '../models/multerRequest.model';
import {ImageService} from '../services/image.service';
import {ProductImage} from '../models/productImage.model';
import {verifyToken} from '../middlewares/checkAuth';


const productController: Router = express.Router();
const imageService = new ImageService();
productController.use(express.static('public'));

/**
 * Creates a new product for the shop. Only admins can add new products.
 */
productController.post('/', checkAdmin, (req: Request, res: Response) => {
    Product.create(req.body).then(created => {
        res.status(201).send(created);
    })
        .catch(err => res.status(500).send(err));
});


/**
 * Updates an existing product. Only admins can modify products.
 */
productController.put('/:id', checkAdmin, (req: Request, res: Response) => {
    Product.findByPk(req.params.id)
        .then(found => {
            if (found != null) {
                found.update(req.body).then(updated => {
                    res.status(200).send(updated);
                });
            } else {
                res.sendStatus(404);
            }
        })
        .catch(err => res.status(500).send(err));
});

/**
 * Sets the 'inUse' field of the specified product to false. This means it will no longer be shown in the shop but will
 * continue to exist in the database.
 */
productController.put('/remove/:id', checkAdmin, (req: Request, res: Response) => {
    Product.findByPk(req.params.id)
        .then(found => {
            if (found != null) {
                found.update( { inUse: false }).then(updated => {
                    res.status(200).send(updated);
                });
            } else {
                res.sendStatus(404);
            }
        })
        .catch(err => res.status(500).send(err));
});

/**
 * Deletes a product. Needs the id of the product to be destroyed.
 * This is the delete-method can only be used by admins.
 */
productController.delete('/:id', checkAdmin, (req: Request, res: Response) => {
    Product.findByPk(req.params.id)
        .then(found => {
            if (found != null) {
                if (found.productImage) {
                    ProductImage.findOne({where: {productId: req.params.id}})
                        .then(image => imageService.deleteProductImageFile(image.imageId))
                        .then(() => found.destroy())
                        .then(item => res.status(200).send({deleted: item}))
                        .catch(err => res.status(500).send(err));
                } else {
                    found.destroy()
                        .then(item => res.status(200).send({deleted: item}))
                        .catch(err => res.status(500).send(err));
                }
            } else {
                res.sendStatus(404);
            }
        })
        .catch(err => res.status(500).send(err));
});


/**
 * Reads all existing Products that are still in use. No access barrier.
 */
productController.get('/inUse',
    (req: Request, res: Response) => {
        Product.findAll({where: {inUse: true}}).then(products => res.send(products)).catch(err => res.status(500).send(err));
    }
);

/**
 * Get Product by its productId
 */
productController.get('/:id',
    (req: Request, res: Response) => {
    Product.findByPk(req.params.id).then(product => res.send(product))
        .catch(err => res.status(500).send(err));
    });
/**
 * upload image and add to a product. User needs to be logged in.
 */
productController.post('/:id/image', verifyToken, (req: MulterRequest, res: Response) => {
    imageService.addImageToProduct(req).then(created => res.send(created)).catch(err => res.status(500).send(err));
});


/**
 * Get image by imageId. No access barrier.
 */
productController.get('/:id/imageById', (req: Request, res: Response) => {
    imageService.getImageItem(Number(req.params.id)).then(products => res.send(products))
        .catch(err => res.status(500).send(err));
});


/**
 * Get image by productId. No access barrier.
 */
productController.get('/:id/imageByProduct', (req: Request, res: Response) => {
    ProductImage.findOne({where: {productId: req.params.id}}).then(products => res.send(products))
        .catch(err => res.status(500).send(err));
});


/**
 * Gets all the products of a certain category that are still in use. No access barrier.
 */
productController.get('/inUse/:postCategoryId/byCategory',
    (req: Request, res: Response) => {
        Product.findAll({where: {
            shopCategoryId: req.params.postCategoryId,
                inUse: true}})
            .then(posts => res.send(posts)).catch(err => res.status(500).send(err));
    }
);

export const ProductController: Router = productController;


import express from 'express';
import { Router, Request, Response } from 'express';
import { Product } from '../models/product.model';
import {checkAdmin} from '../middlewares/checkAdmin';
import {MulterRequest} from '../models/multerRequest.model';
import {ImageService} from '../services/image.service';
import {ProductImage} from '../models/productImage.model';
import {verifyToken} from '../middlewares/checkAuth';


const productController: Router = express.Router();
const itemService = new ImageService();
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
 * Deletes a product. Needs the id of the product to be destroyed.
 * This is the delete-method can only be used by admins.
 */
productController.delete('/:id', checkAdmin, (req: Request, res: Response) => {
    Product.findByPk(req.params.id)
        .then(found => {
            if (found != null) {
                found.destroy()
                    .then(item => res.status(200).send({ deleted: item }))
                    .catch(err => res.status(500).send(err));
            } else {
                res.sendStatus(404);
            }
        })
        .catch(err => res.status(500).send(err));
});


/**
 * Reads all existing Products. No access barrier.
 */
productController.get('/',
    (req: Request, res: Response) => {
        Product.findAll().then(products => res.send(products)).catch(err => res.status(500).send(err));
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
    itemService.addImageToProduct(req).then(created => res.send(created)).catch(err => res.status(500).send(err));
});


/**
 * Get image by imageId. No access barrier.
 */
productController.get('/:id/imageById', (req: Request, res: Response) => {
    itemService.getImageItem(Number(req.params.id)).then(products => res.send(products))
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
 * Gets all the products from a certain category. No access barrier.
 */
productController.get('/:postCategoryId/byCategory',
    (req: Request, res: Response) => {
        Product.findAll({where: {shopCategoryId: req.params.postCategoryId}})
            .then(posts => res.send(posts)).catch(err => res.status(500).send(err));
    }
);

export const ProductController: Router = productController;


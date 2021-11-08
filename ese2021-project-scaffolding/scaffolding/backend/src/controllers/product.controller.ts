import express from 'express';
import { Router, Request, Response } from 'express';
import { Product } from '../models/product.model';
import {verifyToken} from '../middlewares/checkAuth';
import {checkAdmin} from '../middlewares/checkAdmin';
import {MulterRequest} from '../models/multerRequest.model';
import {ItemService} from '../services/item.service';
import {ProductImage} from '../models/productImage.model';


const productController: Router = express.Router();
const itemService = new ItemService();
const path = require('path');
productController.use(express.static('public'));

// CREATE Product
productController.post('/', checkAdmin, (req: Request, res: Response) => {
    Product.create(req.body).then(created => {
        res.status(201).send(created);
    })
        .catch(err => res.status(500).send(err));
});


// UPDATE Product
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
 * Deletes a product. Needs the id of the product which should be destroyed.
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


// READ Products
productController.get('/',
    (req: Request, res: Response) => {
        Product.findAll().then(products => res.send(products)).catch(err => res.status(500).send(err));
    }
);

// upload image and add to a product
productController.post('/:id/image', (req: MulterRequest, res: Response) => {
    itemService.addImageToProduct(req).then(created => res.send(created)).catch(err => res.status(500).send(err));
});


// get the filename of an image
productController.get('/:id/imageById', (req: Request, res: Response) => {
    itemService.getImageItem(Number(req.params.id)).then(products => res.send(products))
        .catch(err => res.status(500).send(err));
});


// get filename of image by productId
productController.get('/:id/imageByProduct', (req: Request, res: Response) => {
    ProductImage.findOne({where: {productId: req.params.id}}).then(products => res.send(products))
        .catch(err => res.status(500).send(err));
});


/**
 * Gets all the products from a certain category.
 */
productController.get('/:categoryId',
    (req: Request, res: Response) => {
        Product.findAll({where: {storeCategoryId: req.params.categoryId}})
            .then(posts => res.send(posts)).catch(err => res.status(500).send(err));
    }
);

export const ProductController: Router = productController;


import express from 'express';
import { Router, Request, Response } from 'express';
import { ShopCategory } from '../models/shopCategory.model';
import {checkAdmin} from '../middlewares/checkAdmin';
import {ShopCategoryService} from '../services/shopCategoryService';

const shopCategoryController: Router = express.Router();
const shopCategoryService = new ShopCategoryService();

/**
 * Adds a category for the shop to memory. Only Admins can access this method.
 */
shopCategoryController.post('/', checkAdmin, (req: Request, res: Response) => {
    ShopCategory.create(req.body).then(created => {
        res.status(201).send(created);
    })
        .catch(err => res.status(500).send(err));
});

/**
 * Updates an existing shop category. Only admins can access this method.
 */
shopCategoryController.put('/:id', checkAdmin, (req: Request, res: Response) => {
    ShopCategory.findByPk(req.params.id)
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
 * Deletes a shop category from memory. Only admins can access this method.
 */
shopCategoryController.delete('/:id', checkAdmin, (req: Request, res: Response) => {
    ShopCategory.findByPk(req.params.id)
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
 * Returns all existing shop categories. No particular access barrier.
 */
shopCategoryController.get('/',
    (req: Request, res: Response) => {
        ShopCategory.findAll().then(categories => res.send(categories)).catch(err => res.status(500).send(err));
    }
);

/**
 * Returns a shop category according to the input id.
 */
shopCategoryController.get('/:id',
    (req: Request, res: Response) => {
        shopCategoryService.getCategory(Number(req.params.id))
            .then(categories => res.send(categories)).catch(err => res.status(500).send(err));
    }
);

export const ShopCategoryController: Router = shopCategoryController;


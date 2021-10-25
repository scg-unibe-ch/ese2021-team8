import express from 'express';
import { Router, Request, Response } from 'express';
import {Category} from '../models/category.model';
import {checkAdmin} from '../middlewares/checkAdmin';

const categoryController: Router = express.Router();

/**
 * Adds a category to memory. Only Admins can access this method.
 */
categoryController.post('/', checkAdmin, (req: Request, res: Response) => {
    Category.create(req.body).then(created => {
        res.status(201).send(created);
    })
        .catch(err => res.status(500).send(err));
});

/**
 * Updates an existing category. Only admins can access this method.
 */
categoryController.put('/:id', checkAdmin, (req: Request, res: Response) => {
    Category.findByPk(req.params.id)
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
 * Deletes a category from memory. Only admins can access this method.
 */
categoryController.delete('/:id', checkAdmin, (req: Request, res: Response) => {
    Category.findByPk(req.params.id)
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
 * Returns all existing categories. No particular access barrier.
 */
categoryController.get('/',
    (req: Request, res: Response) => {
        Category.findAll().then(categories => res.send(categories)).catch(err => res.status(500).send(err));
    }
);

export const CategoryController: Router = categoryController;


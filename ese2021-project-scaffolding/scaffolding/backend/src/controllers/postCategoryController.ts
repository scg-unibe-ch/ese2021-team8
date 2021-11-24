import express from 'express';
import { Router, Request, Response } from 'express';
import {PostCategory} from '../models/postCategory.model';
import {checkAdmin} from '../middlewares/checkAdmin';
import {PostCategoryService} from '../services/postCategoryService';

const postCategoryController: Router = express.Router();
const postCategoryService = new PostCategoryService();

/**
 * Adds a category for posts to memory. Only Admins can access this method.
 */
postCategoryController.post('/', checkAdmin, (req: Request, res: Response) => {
    PostCategory.create(req.body).then(created => {
        res.status(201).send(created);
    })
        .catch(err => res.status(500).send(err));
});

/**
 * Updates an existing post category. Only admins can access this method.
 */
postCategoryController.put('/:id', checkAdmin, (req: Request, res: Response) => {
    PostCategory.findByPk(req.params.id)
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
 * Deletes a post category from memory. Only admins can access this method.
 */
postCategoryController.delete('/:id', checkAdmin, (req: Request, res: Response) => {
    PostCategory.findByPk(req.params.id)
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
 * Returns all existing post categories. No particular access barrier.
 */
postCategoryController.get('/',
    (req: Request, res: Response) => {
        PostCategory.findAll().then(categories => res.send(categories)).catch(err => res.status(500).send(err));
    }
);

/**
 * Returns a post category according to the input id.
 */
postCategoryController.get('/:id',
    (req: Request, res: Response) => {
        postCategoryService.getCategory(Number(req.params.id))
            .then(categories => res.send(categories)).catch(err => res.status(500).send(err));
    }
);

export const PostCategoryController: Router = postCategoryController;


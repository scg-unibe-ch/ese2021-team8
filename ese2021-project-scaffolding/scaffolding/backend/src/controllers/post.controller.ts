import express from 'express';
import { Router, Request, Response } from 'express';
import { Post } from '../models/post.model';
import {verifyToken} from '../middlewares/checkAuth';

const postController: Router = express.Router();

postController.post('/', verifyToken, (req: Request, res: Response) => {
    Post.create(req.body).then(created => {
        res.status(201).send(created);
    })
        .catch(err => res.status(500).send(err));
});

postController.put('/:id', verifyToken, (req: Request, res: Response) => {
    Post.findByPk(req.params.id)
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

postController.delete('/:id', (req: Request, res: Response) => {
    Post.findByPk(req.params.id)
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

postController.get('/',
    (req: Request, res: Response) => {
        Post.findAll().then(posts => res.send(posts)).catch(err => res.status(500).send(err));
    }
);

export const PostController: Router = postController;

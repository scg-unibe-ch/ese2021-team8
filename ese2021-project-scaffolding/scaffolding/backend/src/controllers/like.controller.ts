import express from 'express';
import { Router, Request, Response } from 'express';
import { Like } from '../models/like.model';
import {verifyToken} from '../middlewares/checkAuth';

const likeController: Router = express.Router();

/**
 * Adds a like. User must be logged in to vote.
 */
likeController.post('/', verifyToken, (req: Request, res: Response) => {
    Like.create(req.body).then(created => {
        res.status(201).send(created);
    })
        .catch(err => res.status(500).send(err));
});

/**
 * Gets the likes of a post. No access barrier.
 */
likeController.get('/',
    (req: Request, res: Response) => {
        Like.findAll()
            .then(posts => res.send(posts)).catch(err => res.status(500).send(err));
    }
);

/**
 * Gets the upvotes of a certain post. No access barrier.
 */
likeController.get('/upvotes/:postId',
    (req: Request, res: Response) => {
        Like.findAll({where: { postId: req.params.postId, upvoted: true} })
            .then(posts => res.send(posts)).catch(err => res.status(500).send(err));
    }
);

/**
 * Gets the downvotes of a certain post. No access barrier.
 */
likeController.get('/downvotes/:postId',
    (req: Request, res: Response) => {
        Like.findAll({where: { postId: req.params.postId, downvoted: true} })
            .then(posts => res.send(posts)).catch(err => res.status(500).send(err));
    }
);

/**
 * Removes a given upvote to a post. User must be logged in to vote.
 */
likeController.delete('/upvotes/:userId/:postId', verifyToken, (req: Request, res: Response) => {
        Like.destroy({ where: {userId: req.params.userId, postId: req.params.postId, upvoted: true}})
            .then(item => res.status(200).send({ deleted: item }))
            .catch(err => res.status(500).send(err));
    }
);

/**
 * Removes a given downvote to a post. User must be logged in to vote.
 */
likeController.delete('/downvotes/:userId/:postId', verifyToken, (req: Request, res: Response) => {
        Like.destroy({ where: {userId: req.params.userId, postId: req.params.postId, downvoted: true}})
            .then(item => res.status(200).send({ deleted: item }))
            .catch(err => res.status(500).send(err));
    }
);

export const LikeController: Router = likeController;

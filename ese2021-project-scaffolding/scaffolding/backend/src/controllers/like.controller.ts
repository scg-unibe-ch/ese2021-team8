import express from 'express';
import { Router, Request, Response } from 'express';
import { Like } from '../models/like.model';

const likeController: Router = express.Router();

likeController.post('/', (req: Request, res: Response) => {
    Like.create(req.body).then(created => {
        res.status(201).send(created);
    })
        .catch(err => res.status(500).send(err));
});

likeController.get('/:postId/:creatorId',
    (req: Request, res: Response) => {
        Like.findAll({where: {userId: req.params.creatorId, postId: req.params.postId} })
            .then(posts => res.send(posts)).catch(err => res.status(500).send(err));
    }
);

export const LikeController: Router = likeController;

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

likeController.get('/',
    (req: Request, res: Response) => {
        Like.findAll()
            .then(posts => res.send(posts)).catch(err => res.status(500).send(err));
    }
);

likeController.get('/upvotes/:postId',
    (req: Request, res: Response) => {
        Like.findAll({where: { postId: req.params.postId, upvoted: true} })
            .then(posts => res.send(posts)).catch(err => res.status(500).send(err));
    }
);

likeController.get('/downvotes/:postId',
    (req: Request, res: Response) => {
        Like.findAll({where: { postId: req.params.postId, downvoted: true} })
            .then(posts => res.send(posts)).catch(err => res.status(500).send(err));
    }
);

likeController.delete('/upvotes/:userId/:postId', (req: Request, res: Response) => {
        Like.destroy({ where: {userId: req.params.userId, postId: req.params.postId, upvoted: true}})
            .then(item => res.status(200).send({ deleted: item }))
            .catch(err => res.status(500).send(err));
    }
);

likeController.delete('/downvotes/:userId/:postId', (req: Request, res: Response) => {
        Like.destroy({ where: {userId: req.params.userId, postId: req.params.postId, downvoted: true}})
            .then(item => res.status(200).send({ deleted: item }))
            .catch(err => res.status(500).send(err));
    }
);

export const LikeController: Router = likeController;

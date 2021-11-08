import express from 'express';
import { Router, Request, Response } from 'express';
import { Post } from '../models/post.model';
import {verifyToken} from '../middlewares/checkAuth';
import {checkAdmin} from '../middlewares/checkAdmin';
import {MulterRequest} from '../models/multerRequest.model';
import {upload} from '../middlewares/fileFilter';
import {ItemService} from '../services/item.service';
import {ItemImage} from '../models/itemImage.model';


const postController: Router = express.Router();
const itemService = new ItemService();
const path = require('path');
postController.use(express.static('public'));

// CREATE Post
postController.post('/', verifyToken, (req: Request, res: Response) => {
    Post.create(req.body).then(created => {
        res.status(201).send(created);
    })
        .catch(err => res.status(500).send(err));
});

// UPDATE Post
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

/**
 * Deletes a post. Needs the id of the post which should be destroyed.
 * This is the delete-method used by the administrator. No limit to the post they can destroy.
 */
postController.delete('/admin/:postid/:creator', checkAdmin, (req: Request, res: Response) => {
    Post.findByPk(req.params.postid)
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
 * Deletes a post. Only the author of the post may delete it.
*/
postController.delete('/user/:id/:userId', verifyToken, (req: Request, res: Response) => {
    Post.findByPk(req.params.id)
        .then(found => {
            if (found != null && (found.creatorId === Number(req.params.userId))) {
                found.destroy()
                    .then(item => res.status(200).send({ deleted: item }))
                    .catch(err => res.status(500).send(err));
            } else {
                res.sendStatus(404);
            }
        })
        .catch(err => res.status(500).send(err));
});

// READ Posts
postController.get('/',
    (req: Request, res: Response) => {
        Post.findAll().then(posts => res.send(posts)).catch(err => res.status(500).send(err));
    }
);

// upload image and add to a post
postController.post('/:id/image', (req: MulterRequest, res: Response) => {
    itemService.addImage(req).then(created => res.send(created)).catch(err => res.status(500).send(err));
});

// upload image
postController.post('/uploadImage', upload.single('image'), (req, res) => {
    res.send(req.file);
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message });
});


// get the filename of an image
postController.get('/:id/imageById', (req: Request, res: Response) => {
    itemService.getImageItem(Number(req.params.id)).then(products => res.send(products))
        .catch(err => res.status(500).send(err));
});

// get filename of image by postId
postController.get('/:postId/imageByPost', (req: Request, res: Response) => {
    ItemImage.findOne({where: {postId: req.params.postId}}).then(products => res.send(products))
        .catch(err => res.status(500).send(err));
});

/**
 * Gets all the posts created from a certain creator. Should be used to view posts in profile page.
 */
postController.get('/user/:creatorId', verifyToken,
    (req: Request, res: Response) => {
        Post.findAll({where: {creatorId: req.params.creatorId}}).then(posts => res.send(posts)).catch(err => res.status(500).send(err));
    }
);

/**
 * Gets all the posts from a certain category. No access limitation. Can be used for a basic sort function.
 */
postController.get('/:categoryId',
    (req: Request, res: Response) => {
        Post.findAll({where: {categoryId: req.params.categoryId}}).then(posts => res.send(posts)).catch(err => res.status(500).send(err));
    }
);

export const PostController: Router = postController;

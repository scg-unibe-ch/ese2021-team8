import express from 'express';
import { Router, Request, Response } from 'express';
import { Post } from '../models/post.model';
import {verifyToken} from '../middlewares/checkAuth';
import {checkAdmin} from '../middlewares/checkAdmin';
import {MulterRequest} from '../models/multerRequest.model';
import {upload} from '../middlewares/fileFilter';
import {ImageService} from '../services/image.service';
import {ItemImage} from '../models/itemImage.model';


const postController: Router = express.Router();
const imageService = new ImageService();

postController.use(express.static('public'));

/**
 * Creates a new post. User must be logged in to create posts.
 */
postController.post('/', verifyToken, (req: Request, res: Response) => {
    Post.create(req.body).then(created => {
        res.status(201).send(created);
    })
        .catch(err => res.status(500).send(err));
});

/**
 * Updates an existing post. Should only be done by the author of the post or admins,
 * hence the user must be logged in.
 */
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
 * Deletes a post and its image, if it has one. Needs the id of the post to be destroyed.
 * This is the delete-method used by the administrator. No limit to the post they can destroy.
 */
postController.delete('/admin/:postId/:creator', checkAdmin, (req: Request, res: Response) => {
    Post.findByPk(req.params.postId)
        .then(found => {
            if (found != null) {
                if (found.itemImage) {
                    ItemImage.findOne({where: {postId: req.params.postId}})
                        .then(image => imageService.deleteItemImageFile(image.imageId))
                        .then(() => found.destroy())
                        .then(item => res.status(200).send({deleted: item}))
                        .catch(err => res.status(500).send(err));
                } else {
                    found.destroy()
                        .then(item => res.status(200).send({deleted: item}))
                        .catch(err => res.status(500).send(err));
                }
            } else {
                res.sendStatus(404);
            }
        })
        .catch(err => res.status(500).send(err));
});

/**
 * Deletes a post and its image, if it has one. Only the author of the post may delete it.
*/
postController.delete('/user/:postId/:userId', verifyToken, (req: Request, res: Response) => {
    Post.findByPk(req.params.postId)
        .then(found => {
            if (found != null && (found.creatorId === Number(req.params.userId))) {
                if (found.itemImage) {
                    ItemImage.findOne({where: {postId: req.params.postId}})
                        .then(image => imageService.deleteItemImageFile(image.imageId))
                        .then(() => found.destroy())
                        .then(item => res.status(200).send({deleted: item}))
                        .catch(err => res.status(500).send(err));
                } else {
                    found.destroy()
                        .then(item => res.status(200).send({deleted: item}))
                        .catch(err => res.status(500).send(err));
                }
            } else {
                res.sendStatus(404);
            }
        })
        .catch(err => res.status(500).send(err));
});

/**
 * Reads post. No access barrier.
 */
postController.get('/',
    (req: Request, res: Response) => {
        Post.findAll().then(posts => res.send(posts)).catch(err => res.status(500).send(err));
    }
);

/**
 * upload image and add to a post. User must be logged in.
 */
postController.post('/:id/image', verifyToken, (req: MulterRequest, res: Response) => {
    imageService.addImageToPost(req).then(created => res.send(created)).catch(err => res.status(500).send(err));
});

/**
 * upload image. User must be logged in.
  */
postController.post('/uploadImage', verifyToken, upload.single('image'), (req, res) => {
    res.send(req.file);
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message });
});


/**
 * get the filename of an image. User must be logged in.
 */
postController.get('/:id/imageById', verifyToken, (req: Request, res: Response) => {
    imageService.getImageItem(Number(req.params.id)).then(image => res.send(image))
        .catch(err => res.status(500).send(err));
});

/**
 * get filename of image by postId. No access barrier.
 */
postController.get('/:postId/imageByPost', (req: Request, res: Response) => {
    ItemImage.findOne({where: {postId: req.params.postId}}).then(products => res.send(products))
        .catch(err => res.status(500).send(err));
});

/**
 * Gets 10 posts from the database. This method is not dependent on id,
 * it takes 10 subsequent rows from the table.
 * Table is reversed, so newest posts will be fetched first.
 * Should be used to minimize loading times
 * by only showing some posts at a time. No access barrier.
 * @param pageNumber: Declares which 10 posts the method fetches.
 * For example pageNumber '1' is posts 1-10.
 */
postController.get('/page/:pageNumber',
(req: Request, res: Response) => {
    let pageRange: number;
    pageRange = 10 * Number(req.params.pageNumber) - 10;
    Post.findAll({order: [['createdAt', 'DESC']]
        , offset: pageRange , limit: 10}).then(posts => res.send(posts))
        .catch(err => res.status(500).send(err));
}
);

/**
 * Returns the number of posts existing in the database.
 * Value is returned as String to avoid being interpreted as status.
 * Might be used to determine how many pages are needed.
 * No access barrier.
 */
postController.get('/amount',
    (req: Request, res: Response) => {
        Post.count().then(value => res.send(String(value)))
            .catch(err => res.status(500).send(err));
    }
);

/**
 * Gets all the posts created from a certain creator. Should be used to view posts in profile page.
 * User must be logged in.
 */
postController.get('/user/:creatorId', verifyToken,
    (req: Request, res: Response) => {
        Post.findAll({where: {creatorId: req.params.creatorId}}).then(posts => res.send(posts))
            .catch(err => res.status(500).send(err));
    }
);

/**
 * Returns the number of posts created by a certain user.
 * Value is returned as String to avoid being interpreted as status.
 * Might be used to determine how many pages are needed.
 * User must be logged in.
 */
postController.get('/amount/:creatorId', verifyToken,
    (req: Request, res: Response) => {
        Post.count({where: {creatorId: req.params.creatorId}}).then(value => res.send(String(value)))
            .catch(err => res.status(500).send(err));
    }
);

/**
 * Gets 10 posts created from a certain creator.
 * Table is reversed, so newest posts will be fetched first.
 * Should be used to view posts in profile page.
 * User must be logged in.
 * @param pageNumber: Declares which 10 posts the method fetches.
 * For example pageNumber '1' is posts 1-10.
 */
postController.get('/user/:creatorId/:pageNumber', verifyToken,
    (req: Request, res: Response) => {
        let pageRange: number;
        pageRange = 10 * Number(req.params.pageNumber) - 10;
        Post.findAll({order: [['createdAt', 'DESC']], where: {creatorId: req.params.creatorId}
            , offset: pageRange , limit: 10}).then(posts => res.send(posts))
            .catch(err => res.status(500).send(err));
    }
);

/**
 * Gets all the posts from a certain category. No access limitation. Can be used for a basic sort function.
 */
postController.get('/:postCategoryId',
    (req: Request, res: Response) => {
        Post.findAll({where: {categoryId: req.params.postCategoryId}})
            .then(posts => res.send(posts)).catch(err => res.status(500).send(err));
    }
);

/**
 * Deletes an image file of a given post. Used to edit post.
 *
 * @params postId: Id of the post containing the picture to be deleted.
 */
postController.delete('/image/:postId', (req: Request, res: Response) => {
    ItemImage.findOne({where: {postId: req.params.postId}})
        .then(found => {imageService.deleteItemImageFile(found.imageId).then(() => found.destroy())
        .then(image => res.send(image));
        })
        .catch(err => res.status(500).send(err));
});

export const PostController: Router = postController;

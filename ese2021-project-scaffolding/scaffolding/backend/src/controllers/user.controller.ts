import express, { Router, Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { verifyToken } from '../middlewares/checkAuth';
import { checkAdmin } from '../middlewares/checkAdmin';
import { User } from '../models/user.model';

const userController: Router = express.Router();
const userService = new UserService();

userController.post('/register',
    (req: Request, res: Response) => {
        userService.register(req.body).then(registered => res.send(registered)).catch(err => res.status(500).send(err));
    }
);

userController.post('/login',
    (req: Request, res: Response) => {
        userService.login(req.body).then(login => res.send(login)).catch(err => res.status(500).send(err));
    }
);

/**
 * Let's the user update his userdata, preferably on his profile page.
 */
userController.put('/:id', verifyToken, (req: Request, res: Response) => {
        User.findByPk(req.params.id)
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
    }
);

/**
 * Gets all existing users in the database. Only admins can access this method.
 */
userController.get('/', checkAdmin, // you can add middleware on specific requests like that
    (req: Request, res: Response) => {
        userService.getAll().then(users => res.send(users)).catch(err => res.status(500).send(err));
    }
);

/**
 * Gets the user from the database with a certain id. The user must be logged in and
 * the method should mainly be used to access the users own data.
 */
userController.get('/:id', verifyToken,
    (req: Request, res: Response) => {
    userService.findUserWithId(Number(req.params.id))
        .then(result => res.send(result)).catch(err => res.status(500).send(err));
});

export const UserController: Router = userController;

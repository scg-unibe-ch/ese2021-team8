import express from 'express';
import { Router, Request, Response } from 'express';
import { ShoppingCart} from '../models/shoppingCart.model';
import {checkAdmin} from '../middlewares/checkAdmin';
import {verifyToken} from '../middlewares/checkAuth';

const shoppingCartController: Router = express.Router();

shoppingCartController.post('/', (req: Request, res: Response) => {
    ShoppingCart.create(req.body).then(created => {
        res.status(201).send(created);
    })
        .catch(err => res.status(500).send(err));
});

shoppingCartController.put('/:id', (req: Request, res: Response) => {
    ShoppingCart.findByPk(req.params.id)
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

shoppingCartController.delete('/:id', (req: Request, res: Response) => {
    ShoppingCart.findByPk(req.params.id)
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
 * Gets the shoppingCart with a given id. Currently no constraints towards user,
 * general purpose method.
 */
shoppingCartController.get('/:id', (req: Request, res: Response) => {
    // this automatically fills each shoppingCart with the according products.
    ShoppingCart.findOne({ where: {cartId: req.params.id }, include: [ShoppingCart.associations.products] })
        .then(list => res.status(200).send(list))
        .catch(err => res.status(500).send(err));
});

/**
 * Gets all existing shoppingCarts from a certain user. May be used on his profile page.
 */
shoppingCartController.get('/user/:id', verifyToken, (req: Request, res: Response) => {
    // this automatically fills each shoppingCart with the according products.
    ShoppingCart.findAll({ where: {userId: req.params.id }, include: [ShoppingCart.associations.products] })
        .then(list => res.status(200).send(list))
        .catch(err => res.status(500).send(err));
});

/**
 * Gets all existing shoppingCarts with a given input statement. Currently for admins only.
 * May be used to show the open orders to the admin.
 */
shoppingCartController.get('/status/:status', checkAdmin, (req: Request, res: Response) => {
    // this automatically fills each shoppingCart with the according products.
    ShoppingCart.findAll({ where: {deliveryStatus: req.params.status }, include: [ShoppingCart.associations.products] })
        .then(list => res.status(200).send(list))
        .catch(err => res.status(500).send(err));
});

export const ShoppingCartController: Router = shoppingCartController;

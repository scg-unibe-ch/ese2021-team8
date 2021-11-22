import express from 'express';
import { Router, Request, Response } from 'express';
import { ShoppingCart} from '../models/shoppingCart.model';
import {verifyToken} from '../middlewares/checkAuth';

const shoppingCartController: Router = express.Router();

/**
 * Creates a new element to the shoppingCart. User must be logged in to shop.
 */
shoppingCartController.post('/', verifyToken, (req: Request, res: Response) => {
    ShoppingCart.create(req.body).then(created => {
        res.status(201).send(created);
    })
        .catch(err => res.status(500).send(err));
});

/**
 * Updates an existing element of shoppingCart. User must be logged in.
 */
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

/**
 * Deletes an element from shoppingCart. Might be used to delete a product from an order.
 * User must be logged in.
 */
shoppingCartController.delete('/:id', verifyToken, (req: Request, res: Response) => {
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
 * Gets all products from a certain order. User must be logged in,
 * general purpose method.
 */
shoppingCartController.get('/:orderId', verifyToken, (req: Request, res: Response) => {
    ShoppingCart.findAll({ where: {orderId: req.params.id }})
        .then(list => res.status(200).send(list))
        .catch(err => res.status(500).send(err));
});

export const ShoppingCartController: Router = shoppingCartController;

import express from 'express';
import { Router, Request, Response } from 'express';
import { ShoppingCart} from '../models/ShoppingCart.model';

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
 * Gets all products from a certain order. Currently no constraints towards user,
 * general purpose method.
 */
shoppingCartController.get('/:orderId', (req: Request, res: Response) => {
    ShoppingCart.findAll({ where: {orderId: req.params.id }})
        .then(list => res.status(200).send(list))
        .catch(err => res.status(500).send(err));
});

export const ShoppingCartController: Router = shoppingCartController;

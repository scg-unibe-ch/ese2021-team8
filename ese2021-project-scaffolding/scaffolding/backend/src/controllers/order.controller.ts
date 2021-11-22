import express from 'express';
import { Router, Request, Response } from 'express';
import { Order } from '../models/order.model';
import {checkAdmin} from '../middlewares/checkAdmin';
import {verifyToken} from '../middlewares/checkAuth';

const orderController: Router = express.Router();

/**
 * Creates a new order in the database. A user must be logged in,
 * since his userId is needed in order.
 */
orderController.post('/', verifyToken, (req: Request, res: Response) => {
    Order.create(req.body).then(created => {
        res.status(201).send(created);
    })
        .catch(err => res.status(500).send(err));
});

/**
 * Updates an existing order. User must be logged in to do this.
 * Might be used to cancel an order, so to update the status.
 */
orderController.put('/:id', verifyToken, (req: Request, res: Response) => {
    Order.findByPk(req.params.id)
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
 * Deletes an existing order. User must be logged in.
 * Might be used when cancelling an order before committing it
 */
orderController.delete('/:id', verifyToken, (req: Request, res: Response) => {
    Order.findByPk(req.params.id)
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
 * Get all existing orders. Must be an admin to access method.
 */
orderController.get('/', checkAdmin, (req: Request, res: Response) => {
    Order.findAll().then(orders => res.send(orders)).catch(err => res.status(500).send(err));
});

/**
 * Gets the order with a given id. User must be logged in,
 * general purpose method.
 */
orderController.get('/:id', verifyToken, (req: Request, res: Response) => {
    Order.findOne({ where: {orderId: req.params.id }})
        .then(list => res.status(200).send(list))
        .catch(err => res.status(500).send(err));
});

/**
 * Gets all existing orders from a certain user. May be used on his profile page.
 * User must be logged in.
 */
orderController.get('/user/:id', verifyToken, (req: Request, res: Response) => {
    Order.findAll({ where: {userId: req.params.id }})
        .then(list => res.status(200).send(list))
        .catch(err => res.status(500).send(err));
});

/**
 * Gets a certain order from a certain user. May be used on his profile page.
 */
orderController.get('/userId:/:orderId', verifyToken, (req: Request, res: Response) => {
    Order.findOne({ where: {userId: req.params.userId, orderId: req.params.orderId}})
        .then(list => res.status(200).send(list))
        .catch(err => res.status(500).send(err));
});

/**
 * Gets all existing orders with a given input statement. Currently for admins only.
 * May be used to show the open orders to the admin.
 */
orderController.get('/status/:status', checkAdmin, (req: Request, res: Response) => {
    Order.findAll({ where: {deliveryStatus: req.params.status }})
        .then(list => res.status(200).send(list))
        .catch(err => res.status(500).send(err));
});

export const OrderController: Router = orderController;

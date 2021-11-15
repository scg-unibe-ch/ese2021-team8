import express, { Application , Request, Response } from 'express';
import morgan from 'morgan';
import { TodoItemController } from './controllers/todoitem.controller';
import { TodoListController } from './controllers/todolist.controller';
import { UserController } from './controllers/user.controller';
import { SecuredController } from './controllers/secured.controller';
import { CategoryController} from './controllers/category.controller';
import { ProductController } from './controllers/product.controller';
import { ShoppingCartController } from './controllers/shoppingCart.controller';
import { Sequelize } from 'sequelize';
import { TodoList } from './models/todolist.model';
import { TodoItem } from './models/todoitem.model';
import { User } from './models/user.model';
import { Category } from './models/category.model';
import { ShoppingCart } from './models/shoppingCart.model';

import cors from 'cors';
import {AdminController} from './controllers/admin.controller';
import {ItemImage} from './models/itemImage.model';
import {PostController} from './controllers/post.controller';
import {Post} from './models/post.model';
import {Like} from './models/like.model';
import {LikeController} from './controllers/like.controller';
import {ProductImage} from './models/productImage.model';
import {Product} from './models/product.model';
import {Order} from './models/Order.model';
import {OrderController} from './controllers/order.controller';


export class Server {
    private server: Application;
    private sequelize: Sequelize;
    private port = process.env.PORT || 3000;

    constructor() {
        this.server = this.configureServer();
        this.sequelize = this.configureSequelize();

        TodoItem.initialize(this.sequelize); // creates the tables if they dont exist
        TodoList.initialize(this.sequelize);
        User.initialize(this.sequelize);
        ItemImage.initialize(this.sequelize);
        Category.initialize(this.sequelize);
        Post.initialize(this.sequelize);
        Like.initialize(this.sequelize);
        ProductImage.initialize(this.sequelize);
        Product.initialize(this.sequelize);
        ShoppingCart.initialize(this.sequelize);
        Order.initialize((this.sequelize));
        TodoItem.createAssociations();
        TodoList.createAssociations();
        Post.createAssociations();
        ItemImage.createAssociations();
        ProductImage.createAssociations();
        Product.createAssociations();





        this.sequelize.sync().then(() => {                           // create connection to the database
            this.server.listen(this.port, () => {                                   // start server on specified port
                console.log(`server listening at http://localhost:${this.port}`);   // indicate that the server has started
            });
        });
    }

    private configureServer(): Application {
        // options for cors middleware
        const options: cors.CorsOptions = {
            allowedHeaders: [
                'Origin',
                'X-Requested-With',
                'Content-Type',
                'Accept',
                'X-Access-Token',
            ],
            credentials: true,
            methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
            origin: `http://localhost:${this.port}`,
            preflightContinue: false,
        };

        return express()
            .use(cors())
            .use(express.json())                    // parses an incoming json to an object
            .use(morgan('tiny'))                    // logs incoming requests
            .use('/todoitem', TodoItemController)   // any request on this path is forwarded to the TodoItemController
            .use('/todolist', TodoListController)
            .use('/user', UserController)
            .use('/secured', SecuredController)
            .use('/admin', AdminController)
            .use('/category', CategoryController)
            .use('/post' , PostController)
            .use('/like', LikeController)
            .use('/product', ProductController)
            .use('/cart', ShoppingCartController)
            .use('/order', OrderController)
            .options('*', cors(options))
            .use(express.static('./src/public'))
            // this is the message you get if you open http://localhost:3000/ when the server is running
            .get('/', (req, res) => res.send('<h1>Welcome to the ESE-2021 Backend Scaffolding <span style="font-size:50px">&#127881;</span></h1>'));
    }

    private configureSequelize(): Sequelize {
        return new Sequelize({
            dialect: 'sqlite',
            storage: 'db.sqlite',
            logging: false // can be set to true for debugging
        });
    }
}

const server = new Server(); // starts the server

import { UserAttributes, User } from '../models/user.model';
import { LoginResponse, LoginRequest } from '../models/login.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class UserService {
    /**
     * Registers a new user to the database. The UserAttributes are filled in on the frontend.
     * Before creating the new user, the database is checked whether a user of the same name
     * or mail already exists.
     * @param user: The user data from the register form
     * @return creates either a new user in the database or reject the user
     * due to failure or existing user of the same name.
     */
    public register(user: UserAttributes): Promise<UserAttributes> {
        const saltRounds = 12;
        if (this.doesUserExist(user)) {
            return Promise.reject({ message: 'User already exists'});
        } else {
            user.password = bcrypt.hashSync(user.password, saltRounds); // hashes the password, never store passwords as plaintext
            return User.create(user).then(inserted => Promise.resolve(inserted)).catch(err => Promise.reject(err));
        }}

    public login(loginRequestee: LoginRequest): Promise<User | LoginResponse> {
        const secret = process.env.JWT_SECRET;
        return this.findUser(loginRequestee)
        .then(user => {
            if (bcrypt.compareSync(loginRequestee.password, user.password)) {// compares the hash with the password from the login request
                const token: string = jwt.sign({ userName: user.userName, userId: user.userId, admin: user.admin }, secret, { expiresIn: '2h' });
                return Promise.resolve({ user, token });
            } else {
                return Promise.reject({ message: 'not authorized' });
            }
        })
        .catch(err => Promise.reject({ message: err }));
    }

    public getAll(): Promise<User[]> {
        return User.findAll();
    }

    /**
     * Searches the database if a name or mail is already registered.
     * @param user: the inputs from the register form
     * @return true, if the username or email already exists in the database.
     * False, if not.
     */
    private doesUserExist(user: UserAttributes) {
        const name = User.findOne({where: {userName: user.userName}});
        const mail = User.findOne({where: {email: user.email}});
        return (name || mail) !== null;
    }
    /**
     * Searches the database for a user with the fitting username or email.
     * Returns the user if found, or null if not.
     * @param loginRequestee: the request from the frontend
     */
    private findUser(loginRequestee: LoginRequest) {
        const user = User.findOne({
            where: {
                userName: loginRequestee.userName
            }
        });
        if (user !== null) {
            return user;
        } else {
            return User.findOne({
                where: {
                    email: loginRequestee.userName
                }
            });
        }
    }
}

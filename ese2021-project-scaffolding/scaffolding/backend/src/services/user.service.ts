import { UserAttributes, User } from '../models/user.model';
import { LoginResponse, LoginRequest } from '../models/login.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class UserService {
    /**
     * Registers a new user to the database. The UserAttributes are filled in on the frontend.
     * Before creating the new user, the database is checked whether a user of the same name
     * or mail already exists. If so, the promise gets rejected, else the user is created.
     * @param user: The user data from the register form
     * @return creates either a new user in the database or reject the user
     * due to failure or existing user of the same name.
     */
    public async register(user: UserAttributes): Promise<UserAttributes> {
        const saltRounds = 12;
        const existingName = await this.doesNameExist(user);
        const existingMail = await this.doesMailExist(user);
        return Promise.all([existingName, existingMail]).then((existingUser) => {
        if (existingUser[0] !== null) {
            return Promise.reject({message: 'Username already taken'});
        }
        if (existingUser[1] !== null) {
            return Promise.reject({message: 'Email already in use'});
        } else {
            user.password = bcrypt.hashSync(user.password, saltRounds); // hashes the password, never store passwords as plaintext
            return User.create(user).then(inserted => Promise.resolve(inserted)).catch(err => Promise.reject(err));
        }});
    }

    public login(loginRequestee: LoginRequest): Promise<User | LoginResponse> {
        const secret = process.env.JWT_SECRET;

        return this.findUser(loginRequestee)
            .then(user => {
                if (bcrypt.compareSync(loginRequestee.password, user.password)) {
                    // compares the hash with the password from the login request
                    const token: string = jwt.sign({ userName: user.userName,
                        userId: user.userId, admin: user.admin }, secret, { expiresIn: '2h' });
                    return Promise.resolve({ user, token });
                } else {
                    return Promise.reject({ message: 'Password incorrect' });
                }
            })
            .catch(err => Promise.reject(err));
    }

    public getAll(): Promise<User[]> {
        return User.findAll();
    }

    /**
     * Checks the database whether a given username is already in the database.
     * Returns a promise containing a User if one is found with the fitting name, or null.
     * @param name : the userdata with the name you want to check.
     * @private helper for @see register()
     */
    private doesNameExist(name: UserAttributes): Promise<User | null> {
        return User.findOne({where: {userName: name.userName}});
    }
    /**
     * Checks the database whether a given email is already in the database.
     * Returns a promise containing a User if one is found with the fitting email, or null.
     * @param name : the userdata with the email you want to check.
     * @private helper for @see register()
     */
    private doesMailExist(name: UserAttributes): Promise<User | null> {
        return User.findOne({where: {email: name.email}});
    }
    /**
     * Searches the database for a user with the fitting username or email.
     * Returns the user if found, or null if not.
     * @param loginRequestee: the request from the frontend
     */
    private async findUser(loginRequestee: LoginRequest): Promise<User | null> {
        const userName = await this.findUsername(loginRequestee);
        const userMail = await this.findEmail(loginRequestee);
        return Promise.all([userName, userMail]).then((user) => {
            if (user[0] !== null) { return userName; } else if (user[0] == null && user[1] == null) {
                return Promise.reject({ message: 'Username/Email invalid'} ); } else { return userMail; }});
    }
    private findUsername(loginRequestee: LoginRequest): Promise<User | null> {
        return User.findOne({
            where: {
                userName: loginRequestee.userName
            }
        });
    }
    private findEmail(loginRequestee: LoginRequest): Promise<User | null> {
        return User.findOne({
            where: {
                email: loginRequestee.userName
            }
        });
    }

    /**
     * Searches and returns an User according to the id entered.
     * ToDo: Declare privacy level.
     * @param id the id of the user to find
     */
    public findUserWithId(id: number): Promise<User> {
        return User.findByPk(id)
            .then(result => {
                if (result) {
                    return Promise.resolve(result);
                } else {
                    return Promise.reject('This User does not exist!');
                }
            })
            .catch(() => Promise.reject('could not fetch User!'));
    }
}

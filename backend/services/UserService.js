const moment = require('moment');
const { User } = require('../models');
const { UserBuilder } = require('../builder');
const { UserDao, RoleDao, CartDao } = require('../dao');
const { HashHelper } = require('../utils/HashHelper');
const { TokenHelper } = require('../utils/TokenHelper');
const { Validator } = require('../utils/validator/Validator');
const { UnprocessableEntityError, AuthorizationError, PermissionError } = require('../utils/ErrorHelper/customErrors');
const { CartBuilder } = require('../builder/CartBuilder');

class UserService {

    /**
     * UserService constructor
     * @param   {UserDao}  userDao  user dao
     * @param   {RoleDao}  roleDao  role dao
     * @param   {CartDao}  cartDao  role dao
     */
    constructor(userDao, roleDao, cartDao) {
        this.userDao = userDao;
        this.roleDao = roleDao;
        this.cartDao = cartDao;
    }

    /**
     * release connection
     */
    releaseConnection() {
        this.userDao.client.refuse();
    }

    /**
     * create user instance
     * @param   {{email: string, password: string}}  data  data
     * @return  {User}
     */
    async create(data) {
        // validate data
        const validation = Validator.validate(data, User.rules);
        if (!validation.isValid) {
            throw new UnprocessableEntityError(validation.errors);
        }

        try {

            // check if user with the same email exists in database
            const userExists = await this.userDao.getByProperty('email', data.email);
            if (userExists) {
                throw new UnprocessableEntityError(`User with email ${data.email} exists`);
            }

            // hash password and save
            const hashedPassword = await HashHelper.hashPassword(data.password);
            // get customer role instance
            const customerRole = await this.roleDao.getByProperty('name', 'customer');

            // create user instance
            const user = await this.userDao.create(UserBuilder.Build()
                .addEmail(data.email)
                .addPassword(hashedPassword)
                .addRole(customerRole)
                .build());

            if (user) {
                await this.cartDao.create(CartBuilder.Build()
                    .addUser(user)
                    .addCartProducts([])
                    .addUpdatedAt(moment().unix())
                    .build()
                );
            }
            return user;
        } catch (error) {
            throw error;
        }
    }

    /**
     * login user
     * @param   {{email: string, password: string}}  data  user data
     * @return  {string}
     */
    async login(data) {
        const validation = Validator.validate(data, User.rules);
        if (!validation.isValid) {
            throw new UnprocessableEntityError(validation.errors);
        }

        try {
            // check if user with the same email exists in database
            const user = await this.userDao.getByProperty('email', data.email);
            if (!user || !(await HashHelper.compare(data.password, user.password))) {
                throw new UnprocessableEntityError(`Email or password is invalid`);
            }
            // generate jwt token
            return TokenHelper.generateUserToken(user);
        } catch (error) {
            throw error;
        }
    }

    /**
     * authorize user if exists and add user property to request
     * @param   {Request}  req  req
     * @return  {Promise<User>}
     */
    async authorize(req) {
        let data = null;

        // decode auth token if exists
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1];
            if (!token || !token.trim()) {
                return null;
            }

            try {
                data = await TokenHelper.decodeToken(token);
            } catch (error) {
                throw new AuthorizationError('Invalid authorization token provided');
            }

            return data ? UserBuilder.Build()
                .addId(data.id)
                .addEmail(data.email)
                .addRole(data.role)
                .build() : null;
        }
    }

    /**
     * authorize user
     * @param   {User}  user  user
     * @return  {Prmise<void>}  has permission
     */
    async authorizeUser(user) {
        if (!user) {
            throw new AuthorizationError(['Not Authorized']);
        }
    }

    /**
     * authorize admin
     * @param   {User}  user  user
     * @return  {Prmise<void>}  has permission
     */
    async authorizeAdmin(user) {
        if (!user) {
            throw new AuthorizationError(['Not Authorized']);
        }
        if (user.role.name !== 'admin') {
            throw new PermissionError('Permission denied');
        }
    }
}

module.exports = { UserService };

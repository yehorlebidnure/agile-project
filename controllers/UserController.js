const { ErrorHelper } = require('../utils/ErrorHelper/ErrorHelper');
const { UserService } = require('../services');
const { PermissionError } = require('../utils/ErrorHelper/customErrors/PermissionError');

class UserController {

    /**
     * UserController constructor
     * @param   {UserService}  userService  user service
     */
    constructor(userService) {
        this.userService = userService;
    }

    /**
     * process registration route
     * @param   {Request}   req   request
     * @param   {Response}  res   request
     * @param   {Function}  next  next
     * @return  {Response}
     */
    async registration(req, res, next) {
        try {
            const data = req.body;
            const result = await this.userService.create(data);
            return res.status(201).json(result)
        }
        catch (error) {
            const errorHelper = new ErrorHelper(error);
            return errorHelper.processResponse(res);
        } finally {
            this.userService.releaseConnection();
        }
    }

    /**
     * process registration route
     * @param   {Request}   req   request
     * @param   {Response}  res   request
     * @param   {Function}  next  next
     * @return  {Response}
     */
    async login(req, res, next) {
        try {
            const data = req.body;
            const result = await this.userService.login(data);
            return res.status(200).json({ token: result });
        }
        catch (error) {
            const errorHelper = new ErrorHelper(error);
            return errorHelper.processResponse(res);
        } finally {
            this.userService.releaseConnection();
        }
    }

    /**
     * add property called 'user' to request. if user exists set user else null
     * @param   {Request}   req   request
     * @param   {Response}  res   request
     * @param   {Function}  next  next
     * @return  {Response}
     */
    async authorize(req, res, next) {
        try {
            req.user = await this.userService.authorize(req);
            return next();
        } catch (error) {
            console.log(error);
            const errorHelper = new ErrorHelper(error);
            return errorHelper.processResponse(res);
        } finally {
            this.userService.releaseConnection();
        }
    }

    /**
     * check if user authorized
     * @param   {Request}   req   request
     * @param   {Response}  res   request
     * @param   {Function}  next  next
     * @return  {Response}
     */
    async authorizeUser(req, res, next) {
        try {
            await this.userService.authorizeUser(req.user);
            return next();
        }
        catch (error) {
            const errorHelper = new ErrorHelper(error);
            return errorHelper.processResponse(res);
        } finally {
            this.userService.releaseConnection();
        }
    }

    /**
     * authorize admin
     * @param   {Request}   req   request
     * @param   {Response}  res   request
     * @param   {Function}  next  next
     * @return  {Response}
     */
    async authorizeAdmin(req, res, next) {
        try {
            await this.userService.authorizeAdmin(req.user);
            return next();
        }
        catch (error) {
            const errorHelper = new ErrorHelper(error);
            return errorHelper.processResponse(res);
        } finally {
            this.userService.releaseConnection();
        }
    }
}

module.exports = { UserController };

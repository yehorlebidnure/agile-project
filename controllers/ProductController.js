const { ErrorHelper } = require('../utils/ErrorHelper/ErrorHelper');
const { ProductService } = require('../services');

class ProductController {

    /**
     * ProductService constructor
     * @param   {ProductService}  productService  product service
     */
    constructor(productService) {
        this.productService = productService;
    }

    /**
     * get all products by query parameters
     * @param {Request}   req   request
     * @param {Response}  res   response
     * @param {Function}  next  next
     * @returns {Response}
     */
    async getAll(req, res, next) {
        try {
            const params = req.query;
            const result = await this.productService.getAll(params);
            return res.status(200).json({ products: result });
        }
        catch (error) {
            const errorHelper = new ErrorHelper(error);
            return errorHelper.processResponse(res);
        } finally {
            this.productService.releaseConnection();
        }
    }

    /**
     * get product by id
     * @param {Request}   req   request
     * @param {Response}  res   response
     * @param {Function}  next  next
     * @returns {Response}
     */
    async getById(req, res, next) {
        try {
            const id = req.params.id;
            const user = req.user;
            const result = await this.productService.getById(id, user);
            return res.status(200).json(result);
        }
        catch (error) {
            const errorHelper = new ErrorHelper(error);
            return errorHelper.processResponse(res);
        } finally {
            this.productService.releaseConnection();
        }
    }

    /**
     * create product
     * @param {Request}   req   request
     * @param {Response}  res   response
     * @param {Function}  next  next
     * @returns {Response}
     */
    async create(req, res, next) {
        try {
            const data = req.body;
            const result = await this.productService.create(data);
            return res.status(200).json(result);
        }
        catch (error) {
            const errorHelper = new ErrorHelper(error);
            return errorHelper.processResponse(res);
        } finally {
            this.productService.releaseConnection();
        }
    }

    /**
     * update product
     * @param {Request}   req   request
     * @param {Response}  res   response
     * @param {Function}  next  next
     * @returns {Response}
     */
    async update(req, res, next) {
        try {
            const id = +req.params.id;
            const data = req.body;
            const result = await this.productService.update(id, data);
            return res.status(200).json(result);
        }
        catch (error) {
            const errorHelper = new ErrorHelper(error);
            return errorHelper.processResponse(res);
        } finally {
            this.productService.releaseConnection();
        }
    }

    /**
     * delete product instance
     * @param {Request}   req   request
     * @param {Response}  res   response
     * @param {Function}  next  next
     * @returns {Response}
     */
    async delete(req, res, next) {
        try {
            const id = +req.params.id
            await this.productService.delete(id);
            return res.sendStatus(200);
        }
        catch (error) {
            console.log(error);
            const errorHelper = new ErrorHelper(error);
            return errorHelper.processResponse(res);
        } finally {
            this.productService.releaseConnection();
        }
    }
}

module.exports = { ProductController };

const { DaoFactory } = require('./DaoFactory');
const { UserService, ImageService, ProductService, CategoryService, CartService } = require('../services');

class ServiceFactory {

    /**
     * allowed dao types
     * @return  {string[]}
     */
    static get types() {
        return ['user', 'image', 'product', 'category', 'cart'];
    }

    /**
     * create service
     * @param   {'image'|'product'|'user'|'category'|'cart'}  type  dao type
     * @return  {Promise<UserService|ImageService|ProductService|CategoryService>}
     */
    static async createService(type) {
        if (!type || typeof type !== 'string' || !ServiceFactory.types.includes(type)) {
            return null;
        }

        try {
            // create dao
            if (type === 'user') {
                const client = await DaoFactory.createClient()
                return new UserService(...(await Promise.all([
                    DaoFactory.createDao('user', client),
                    DaoFactory.createDao('role', client),
                    DaoFactory.createDao('cart', client),
                ])));
            }
            else if (type === 'image') {
                const client = await DaoFactory.createClient();
                return new ImageService(...(await Promise.all([
                    DaoFactory.createDao('image', client),
                    DaoFactory.createDao('product', client),
                ])));
            }
            else if (type === 'product') {
                const client = await DaoFactory.createClient();
                return new ProductService(...(await Promise.all([
                    DaoFactory.createDao('product', client),
                    DaoFactory.createDao('image'),
                    DaoFactory.createDao('category', client),
                    DaoFactory.createDao('productView', client),
                    DaoFactory.createDao('cart', client),
                ])));
            }
            else if (type === 'category') {
                const categoryDao = await DaoFactory.createDao('category');
                return new CategoryService(categoryDao);
            }
            else if (type === 'cart') {
                const client = await DaoFactory.createClient();
                return new CartService(...(await Promise.all([
                    DaoFactory.createDao('cart', client),
                    DaoFactory.createDao('product', client)
                ])));
            }
        } catch (error) {
            throw new ServerError(`Failed to create "${type}" service`);
        }

        return null;
    }
}

module.exports = { ServiceFactory };
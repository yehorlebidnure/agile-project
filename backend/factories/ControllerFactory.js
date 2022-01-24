const { ServiceFactory } = require('./ServiceFactory');
const {
    CartController,
    UserController,
    ImageController,
    ProductController,
    CategoryController,
} = require('../controllers');

class ControllerFactory {

    /**
     * allowed dao types
     * @return  {string[]}
     */
    static get types() {
        return ['user', 'image', 'product', 'category', 'cart'];
    }

    /**
     * get controller
     * @param   {'user'|'image'|'product'|'category'|'cart'}  type  controller type
     * @return  {Promise<UserController|ImageController>}
     */
    static async createController(type) {
        if (!type || typeof type !== 'string' || !ControllerFactory.types.includes(type)) {
            return null;
        }

        try {
            // create controller
            if (type === 'user') {
                return new UserController(
                    await ServiceFactory.createService('user')
                );
            }
            else if (type === 'image') {
                return new ImageController(
                    await ServiceFactory.createService('image')
                );
            }
            else if (type === 'product') {
                return new ProductController(
                    await ServiceFactory.createService('product')
                );
            } else if (type === 'category') {
                return new CategoryController(
                    await ServiceFactory.createService('category')
                );
            } else if (type === 'cart') {
                return new CartController(
                    await ServiceFactory.createService('cart')
                );
            }
        } catch (error) {
            throw new ServerError('Failed to create controller');
        }
        return null;
    }

    /**
     * create user controller
     * @return  {Promise<UserController>}
     */
    static createUserController() {
        return ControllerFactory.createController('user');
    }

    /**
     * create image controller
     * @return  {Promise<ImageController>}
     */
    static createImageController() {
        return ControllerFactory.createController('image');
    }

    /**
     * create product controller
     * @return  {Promise<ProductController>}
     */
    static createProductController() {
        return ControllerFactory.createController('product');
    }

    /**
     * create product controller
     * @return  {Promise<CategoryController>}
     */
    static createCategoryController() {
        return ControllerFactory.createController('category');
    }

    /**
     * create cart controller
     * @return  {Promise<CartController>}
     */
    static createCartController() {
        return ControllerFactory.createController('cart');
    }

}

module.exports = { ControllerFactory };
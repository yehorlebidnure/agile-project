const {Connection} = require('../core/Connection');
const { Dao } = require('../core/Dao');
const { ProductView } = require('../models/ProductView');
const { ServerError } = require('../utils/ErrorHelper/customErrors');
const { ProductViewBuilder } = require('../builder/ProductViewBuilder');

class ProductViewDao extends Dao {

    /**
     * UserDatabaseClient constructor
     * @param   {Connection}  client  client connection
     */
    constructor(client) {
        super(client);
    }

    /**
     * get product view vy user id and product id
     * @param   {number}  userId     user id
     * @param   {number}  productId  product id
     * @return  {Promise<ProductView>}
     */
    async getByUserIdAndProductId(userId, productId) {
        let productView = null;
        const value = [userId, productId];
        const sql = `select user_id, product_id, quantity, updated_at 
        from product_views where user_id = $1 and product_id = $2`;

        try {
            const data = await this.client.query(sql, value);
            const res = data.rows[0];

            if (!res) {
                return null;
            }

            productView = ProductViewBuilder.Build()
                .addUserId(res['user_id'])
                .addProductId(res['product_id'])
                .addQuantity(res['quantity'])
                .addUpdatedAt(res['updated_at'])
                .build();
        }
        catch (error) {
            throw new ServerError(`Failed to get product view from database`);
        }
        return productView;
    }

    /**
     * get product views by parameter
     * @param   {ProductView}  productView
     * @return  {Promise<ProductView>}
     */
    async create(productView) {
        const { userId, productId, quantity, updatedAt } = productView;
        const value = [userId, productId, quantity, updatedAt];
        const sql = `insert into product_views(user_id, product_id, quantity, updated_at) 
        values($1,$2,$3,$4)`;

        try {
            await this.client.query(sql, value);
        }
        catch (error) {
            throw new ServerError(`Failed to create product view in database`);
        }
        return productView;
    }

    /**
     * get product views by parameter
     * @param   {ProductView}  productView
     * @return  {Promise<ProductView>}
     */
    async update(productView) {
        const { userId, productId, quantity, updatedAt } = productView;
        const value = [quantity, updatedAt, userId, productId];
        const sql = `update product_views
        set quantity = $1, updated_at = $2
        where user_id = $3 and product_id = $4`;

        try {
            await this.client.query(sql, value);
        }
        catch (error) {
            throw new ServerError(`Failed to update product view in database`);
        }
        return productView;
    }

    /**
     * delete product data by productId
     * @param   {number}  productId  
     * @return  {Promise<void>}
     */
    async deleteByProductId(productId) {
        const sql = 'delete from product_views where product_id = $1';
        const values = [productId];
        try {
            await this.client.query(sql, values);
        }
        catch (error) {
            throw new ServerError(`Failed to delete product view data from database`);
        }
    }
}

module.exports = { ProductViewDao };

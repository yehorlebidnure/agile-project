const {Connection} = require('../core/Connection');
const { Product } = require('../models');
const { Dao } = require('../core/Dao');
const { ProductBuilder, ImageBuilder, CategoryBuilder } = require('../builder');
const { ServerError } = require('../utils/ErrorHelper/customErrors');

class ProductDao extends Dao {
    /**
     * UserDatabaseClient constructor
     * @param   {Connection}  client  client connection
     */
    constructor(client) {
        super(client);
    }

    /**
     * get default schema for product
     */
    getDefaultSchema() {
        return {
            id: 'id',
            title: 'title',
            description: 'description',
            price: 'price',
            isPromo: 'is_promo',
            image: 'image',
            createdAt: 'created_at',
            category: {
                id: 'c_id',
                title: 'c_title'
            }
        }
    }

    /**
     * get product by property and its value
     * @param   {number|string}     id product id
     * @return  {Promise<Product>}
     */
    getById(id) {
        const sql = `select 
        p.id, p.title, p.description, p.price, p.is_promo, p.image, p.created_at,
        c.id as c_id, c.title as c_title
        from products p
        join categories c on (c.id = p.category_id)
        ${!isNaN(id) ? 'where p.id = $1' : ''}
        ${id === 'random' ? 'order by random() limit 1' : ''}`;

        const values = [];
        if (!isNaN(id)) values.push(id);

        const schema = this.getDefaultSchema();
        return this.executeProducts(sql, values, schema, true);
    }

    /**
     * get recently added products
     * @param {number} categoryId 
     * @param {amount: number, page: number} params 
     * @returns {Promise<Product[]>}
     */
    getRecentlyAddedProducts({ amount = 10, page = 1 }) {
        const sql = `
        select p.id, p.title, p.description, p.price, p.is_promo, p.image, p.created_at,
        c.id as c_id, c.title as c_title
        from products p 
        join categories c on (c.id = p.category_id)
        order by p.created_at desc limit $1 offset $2;`;
        const offset = (page - 1) * amount;
        const values = [amount, offset];
        const schema = this.getDefaultSchema();
        return this.executeProducts(sql, values, schema);
    }

    /**
     * get popular products
     * @param {number} categoryId 
     * @param {amount: number, page: number} params 
     * @returns {Promise<Product[]>}
     */
    getPopularProducts({ amount = 10, page = 1 }) {
        const sql = `
        select p.id, p.title, p.description, p.price, p.is_promo, p.image, p.created_at,
        c.id as c_id, c.title as c_title
        from products p 
        join product_views pv on (pv.product_id = p.id)
        join categories c on (c.id = p.category_id)
        order by pv.quantity
        limit $1 offset $2;
        `;
        const offset = (page - 1) * amount;
        const values = [amount, offset];
        const schema = this.getDefaultSchema();
        return this.executeProducts(sql, values, schema);
    }

    /**
     * get recomended products
     * @param {number} categoryId 
     * @param {amount: number, page: number} params 
     * @returns {Promise<Product[]>}
     */
    getRecomendedProducts({ amount = 10, page = 1, orderBy, isDesc }) {
        const sql = `
        select p.id, p.title, p.description, p.price, p.is_promo, p.image, p.created_at,
        c.id as c_id, c.title as c_title
        from products p
        join categories c on (c.id = p.category_id)
        where p.is_promo = true
        ${orderBy ? `order by ${orderBy} ` : ''} 
        ${isDesc && isDesc !== 'false' ? 'desc' : ''}
        limit $1 offset $2;
        `;
        const offset = (page - 1) * amount;
        const values = [amount, offset];
        const schema = this.getDefaultSchema();
        return this.executeProducts(sql, values, schema);
    }

    /**
     * get products by category id
     * @param {number} categoryId 
     * @param {amount: number, page: number} params 
     * @returns {Promise<Product[]>}
     */
    getProductsByCategoryIdAndParams(categoryId, { amount = 10, page = 1, orderBy, isDesc, minPrice, maxPrice }) {
        let idx = 4;    // $1 and $2 is for limit
        const sql = `
        with recursive r as (
            select c1.id, c1.title from categories c1 where c1.id = $1
            union
            select c2.id, c2.title from categories c2
            join r on c2.parent_id = r.id
        )
        select p.id, p.title, p.description, p.price, p.is_promo, p.image, p.created_at,
        r.id as c_id, r.title as c_title
        from r join products p on p.category_id = r.id
        ${minPrice || maxPrice ? 'where ' : ''}
        ${minPrice ? `price > $${idx++}` : ''}
        ${minPrice != undefined && maxPrice != undefined ? ' and ' : ''}
        ${maxPrice ? `price < $${idx++}` : ''}
        ${orderBy ? `order by ${orderBy} ` : ''} 
        ${isDesc && isDesc !== 'false' ? 'desc' : ''}
        limit $2 offset $3;
        `;
        const offset = (page - 1) * amount;
        const values = [categoryId, amount, offset];

        if (minPrice !== undefined) values.push(minPrice);
        if (maxPrice !== undefined) values.push(maxPrice);

        const schema = this.getDefaultSchema();
        return this.executeProducts(sql, values, schema);
    }

    /**
     * get product views by parameter
     * @param   {number}  userId  user id
     * @param   {number}  limit   limit
     * @return  {Promise<Product[]>}
    */
    getBySearch({ search, amount = 10, page = 1, orderBy, isDesc, minPrice, maxPrice }) {
        let idx = 4;
        const sql = `
        select p.id, p.title, p.description, p.price, p.is_promo, p.image, p.created_at,
        c.id as c_id, c.title as c_title
        from products p
        join categories c on (c.id = p.category_id)
        where (p.title ilike $1 or p.description ilike $1)
        ${minPrice || maxPrice ? ' and ' : ''}
        ${minPrice ? `price > $${idx++}` : ''}
        ${minPrice != undefined && maxPrice != undefined ? ' and ' : ''}
        ${maxPrice ? `price < $${idx++}` : ''}
        ${orderBy ? `order by ${orderBy} ` : ''}
        ${isDesc && isDesc !== 'false' ? 'desc' : ''}
        limit $2 offset $3;
        `;
        const offset = (page - 1) * amount;
        const values = [`%${search}%`, amount, offset];

        if (minPrice !== undefined) values.push(minPrice);
        if (maxPrice !== undefined) values.push(maxPrice);

        const schema = this.getDefaultSchema();
        return this.executeProducts(sql, values, schema);
    }

    /**
     * get product views by parameter
     * @param   {number}  userId  user id
     * @param   {number}  limit   limit
     * @return  {Promise<Product[]>}
    */
    getMostViewedProductByUserId(userId, { amount, page }) {
        const sql = `select 
        p.id, p.title, p.description, p.price, p.is_promo, p.image, p.created_at,
        c.id as c_id, c.title as c_title
        from product_views pv
        join products p on (pv.product_id = p.id)
        join categories c on (c.id = p.category_id)
        where pv.user_id = $1
        order by pv.quantity desc
        limit $2 offset $3`;
        const offset = (page - 1) * amount;
        const values = [userId, amount, offset];
        const schema = this.getDefaultSchema();

        return this.executeProducts(sql, values, schema);
    }

    /**
     * get producs for cart
     * @param   {number[]}    ids
     * @return  {Promise<Product[]>}
    */
    getForCart(ids) {
        const list = ids.map((id, idx) =>
            idx !== ids.length - 1 ? `$${idx + 1},` : `$${idx + 1}`
        ).join('');

        const sql = `select 
        id, title, description, price, is_promo, image, created_at
        from products where id in(${list})`;
        const values = [...ids];
        const schema = this.getDefaultSchema();

        return this.executeProducts(sql, values, schema);
    }

    async executeProducts(sql, values, schema = {}, isSingle = false) {
        const products = [];
        try {
            // fetch data
            const data = await this.client.query(sql, values);
            const res = data.rows;

            res.forEach(row => {
                // create product
                const product = new Product();

                if (schema.id) product.id = +row[schema.id]
                if (schema.title) product.title = row[schema.title]
                if (schema.description) product.description = row[schema.description]
                if (schema.isPromo) product.isPromo = row[schema.isPromo]
                if (schema.price) product.price = +row[schema.price]
                if (schema.image) product.image = row[schema.image]
                if (schema.createdAt) product.createdAt = row[schema.createdAt]
                if (schema.category) {
                    product.category = {
                        id: row[schema.category.id],
                        title: row[schema.category.title]
                    };
                }

                products.push(product);
            });
        }
        catch (error) {
            console.error(error);
            throw new ServerError(`Failed to get products from database`);
        }
        return isSingle ? products[0] : products;
    }

    /**
     * create product in database
     * @param   {Product}  product  product
     * @return  {Promise<Product>}
     */
    async create(product) {
        const sql = `insert into 
        products(title, description, price, is_promo, image, category_id, created_at) 
        values($1, $2, $3, $4, $5, $6, $7) returning id;`
        const values = [
            product.title,
            product.description,
            product.price,
            product.isPromo,
            JSON.stringify(product.image),
            product.category.id,
            product.createdAt,
        ];

        const schema = { id: 'id' };
        try {
            const created = await this.executeProducts(sql, values, schema, true);
            product.id = created.id;
            return product;
        } catch (error) {
            throw new ServerError('Failed to create product')
        }
    }

    /**
     * update product by property
     * @param   {Product}           product   product
     * @param   {'title'|'description'|'price'|'is_promo'|category_id} name   property name
     * @param   {number|string}     value  property value
     * @returns {Promise<number|string>}
     */
    async updateProperty(product, name, value) {
        const sql = `update products set ${name} = $1 where id = $2 returning ${name}`;
        updatedValue = name !== 'image' ? value : JSON.stringify(value)
        const values = [updatedValue, product.id];
        try {
            await this.executeProducts(sql, values);
            return value;
        } catch (error) {
            throw new ServerError('Failed to update product property')
        }
    }

    /**
     * update product
     * @param   {Product}  product  product
     * @return  {Promise<void>}
     */
    async update(product) {
        const sql = `update products 
        set title=$2, description=$3, price=$4, image=$5, is_promo=$6, category_id=$7, created_at=$8
        where id = $1`;
        const values = [
            product.id,
            product.title,
            product.description,
            product.price,
            JSON.stringify(product.image),
            product.isPromo,
            product.category.id,
            product.createdAt,
        ];
        try {
            await this.executeProducts(sql, values);
            return product;
        } catch (error) {
            throw new ServerError('Failed to create products');
        }
    }

    /**
     * update property
     * @param   {number}  id     product id
     * @param   {string}  name   property name
     * @param   {number|string|boolean}  value  value
     * @return  {void}
     */
    async updatePropertyById(id, name, value) {
        if (!Product.attributes.includes(name)) {
            throw new Error('Failed to update user property: Invalid property provided');
        }
        const sql = `update products set ${name}=$2 where id = $1`;
        const values = [id, value];
        await this.executeProducts(sql, values);
    }

    /**
     * delete product by id
     * @param   {number}  id product id
     * @return  {Promise<void>}
     */
    async deleteById(id) {
        const sql = `delete from products where id = $1`;
        const values = [id];
        await this.executeProducts(sql, values);
    }
}

module.exports = { ProductDao };

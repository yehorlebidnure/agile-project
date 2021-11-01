const { Image } = require('../models');
const { ImageDao } = require('../dao');
const { BadRequestError } = require('../utils/ErrorHelper/customErrors/BadRequestError');

class ImageService {

    /**
     * ImageService constructor
     * @param   {ImageDao}  imageDao  image dao
     * @param   {ProductDao}  productDao  image dao
     */
    constructor(imageDao, productDao) {
        this.imageDao = imageDao;
        this.productDao = productDao;
    }

    /**
     * release connection
     */
    releaseConnection() {
        this.productDao.client.refuse();
    }

    /**
     * save image
     * @param   {Request}  req  request
     * @return  {Promise<Image>}
     */
    async save(req) {
        const productId = req.params['id'];
        try {
            const image = await this.imageDao.save(req);
            await this.productDao.updatePropertyById(productId, 'image', JSON.stringify(image));
            return image;
        } catch (error) {
            await this.delete(productId);
            throw new BadRequestError('Failed to save image');
        }
    }

    /**
     * delete images by product id
     * @param   {number}  productId
     * @return  {void}
     */
    async delete(productId) {
        await this.imageDao.delete(productId);
    }
}

module.exports = { ImageService };

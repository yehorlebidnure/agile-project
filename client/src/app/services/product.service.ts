import {Injectable} from '@angular/core';
import {ErrorService} from './error.service';
import {ProductApiService} from './product-api.service';
import {IProduct, IProductImage, IProductQueryParameters} from '../interfaces/product.interface';
import {Product} from '../classes/product.class';
import {NotificationService} from './notification.service';
import {AuthService} from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class ProductService {

    constructor(
        private errorService: ErrorService,
        private productApi: ProductApiService,
        private notificationService: NotificationService,
    ) {
    }

    /**
     * create category
     * @param product
     */
    public async create(product: IProduct): Promise<IProduct> {
        try {
            const createdProduct = await this.createProduct(product);
            if (product.imageFile) {
                const createdImage = await this.setProductImage(createdProduct.id, product.imageFile);
                return {...createdProduct, image: createdImage};
            }
            return createdProduct;
        } catch (error) {
            this.errorService.processErrorResponse(error);
        }
    }

    /**
     * create category
     * @param product
     * @private
     */
    private async createProduct(product: IProduct): Promise<IProduct> {
        const {image, ...productData} = product;
        return await this.productApi.createProduct(productData);
    }

    /**
     * update category
     * @param prev
     * @param next
     */
    public async update(prev: IProduct, next: IProduct): Promise<IProduct> {

        next.id = prev.id
        if (!next.imageFile && Product.compare(prev, next)) {
            const msg = 'Failed to update: You haven\'t changed any property';
            this.notificationService.setInfoNotification(msg);
            return next;
        }

        if (next.imageFile) {
            await this.setProductImage(prev.id, next.imageFile);
        }

        if (!Product.compare(prev, next)) {
            next.id = prev.id;
            await this.updateProduct(next);
        }

        return {...prev, ...next};
    }

    /**
     * update category instance
     * @param product
     * @private
     */
    private async updateProduct(product: IProduct): Promise<IProduct> {
        try {
            const {imageFile, ...productData} = product;
            return await this.productApi.updateProduct(productData);
        } catch (error) {
            this.errorService.processErrorResponse(error);
        }
    }

    /**
     * set category image
     * @param productId
     * @param image
     * @private
     */
    public async setProductImage(productId: number, image: Blob): Promise<IProductImage> {
        try {
            return await this.productApi.setProductImage(productId, image);
        } catch (error) {
            this.errorService.processErrorResponse(error);
        }
    }

    /**
     * fetch products from server
     * @param params
     */
    public async fetchProductsByParameters(params: IProductQueryParameters): Promise<IProduct[]> {
        try {
            const response = await this.productApi.fetchProductsByParameters(params);
            return response.products;
        } catch (error) {
            this.errorService.processErrorResponse(error);
        }
    }

    /**
     * fetch category from server
     * @param id
     */
    public async fetchProductById(id: number|string): Promise<IProduct> {
        try {
            return await this.productApi.fetchProductById(id);
        } catch (error) {
            this.errorService.processErrorResponse(error);
        }
    }

    /**
     * delete product from server by id
     * @param product
     */
    public async delete(product: IProduct): Promise<boolean> {
        try {
            return await this.productApi.deleteById(product.id);
        } catch (error) {
            this.errorService.processErrorResponse(error);
        }
    }
}

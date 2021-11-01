import {Component, Input} from '@angular/core';
import {IProduct} from '../../interfaces/product.interface';
import {AuthService} from '../../services/auth.service';

@Component({
    selector: 'app-product-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent {
    @Input('products') products: IProduct[] = [];

    constructor(
        private authService: AuthService
    ) {
    }

    get isAdmin(): boolean {
        return this.authService.isRole('admin');
    }

    /**
     * remove product from product list after delete
     * @param product
     */
    handleOnDelete(product: IProduct) {
        this.products = this.products.filter(p => p.id !== product.id);
    }

}

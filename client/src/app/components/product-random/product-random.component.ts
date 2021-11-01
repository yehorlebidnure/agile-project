import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {ProductService} from '../../services/product.service';
import {IProduct} from '../../interfaces/product.interface';

@Component({
    selector: 'app-product-random',
    templateUrl: './product-random.component.html',
    styleUrls: ['./product-random.component.scss']
})
export class ProductRandomComponent implements OnInit {

    public product: IProduct;
    public loading = false;

    constructor(
        private authService: AuthService,
        private productService: ProductService,
    ) {
    }

    ngOnInit(): void {
        this.loading = true;
        this.productService.fetchProductById('random').then(product => {
            this.product = product;
            this.loading = false;
        });
    }

    get isAdmin() {
        return this.authService.isRole('admin');
    }

}

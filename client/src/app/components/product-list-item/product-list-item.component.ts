import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IProduct } from '../../interfaces/product.interface';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';

@Component({
    selector: 'app-product-list-item',
    templateUrl: './product-list-item.component.html',
    styleUrls: ['./product-list-item.component.scss']
})
export class ProductListItemComponent {
    @Input('product') product: IProduct;
    @Input('isAdmin') isAdmin: boolean = false;
    @Input('isSingle') isSingle: boolean = false;
    @Output('onDelete') onDelete = new EventEmitter<IProduct>();
    public loading = false;

    constructor(
        private router: Router,
        private cartService: CartService,
        private productService: ProductService
    ) {
    }

    /**
     * handle change product promo
     */
    handleRecommendationChange() {
        this.loading = true;
        const prev = this.product;
        const next = {...this.product, isPromo: !this.product.isPromo};
        this.productService.update(prev, next).then(updated => {
            this.product.isPromo = next.isPromo;
            this.loading = false;
        });
    }

    handleNavigate() {
        const extras = { state: { productToShow: this.product } };
        this.router.navigateByUrl(`/products/${this.product.id}`, extras);
    }

    handleAddProductToCart(product: IProduct) {
        this.cartService.addProduct(product, 1);
    }

    getImageSrc(): string {
        return environment.url + this.product.image.medium;
    }

    /**
     * handle navigate manage
     */
    handleNavigateManage(): void {
        const extras = { state: { productToUpdate: this.product } };
        this.router.navigateByUrl(`/admin/products/${this.product.id}`, extras);
    }

    /**
     * handle delete product
     */
    handleDelete(): void {
        this.productService.delete(this.product).then(res => {
            if (res) {
                this.onDelete.emit(this.product);
            }
        });
    }
}

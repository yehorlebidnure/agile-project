import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {IProductQueryParameters} from '../../interfaces/product.interface';
import {ICategory} from '../../interfaces/category.interface';

@Component({
    selector: 'app-product-page',
    templateUrl: './product-category-page.html',
    styleUrls: ['./product-category-page.scss']
})
export class ProductCategoryPage implements OnInit {
    public show = false;
    public params: any = {};
    private paramsSubscription: Subscription;

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) {
    }

    ngOnInit(): void {
        this.subscribeOnRouteDataChange();
    }

    private subscribeOnRouteDataChange() {
        this.paramsSubscription = this.activatedRoute.params.subscribe(params => {
            if (params.categoryId) {
                this.params.categoryId = +params.categoryId;
            }
        });
    }

    /**
     * toggle show sidebar
     */
    toggleSidebar() {
        this.show = !this.show;
    }

    /**
     * redirect to products category page
     * @param category
     */
    handleCategoryClick(category: ICategory) {
        if (category.id) {
            this.router.navigateByUrl(`/categories/${category.id}`,);
        }
    }

}

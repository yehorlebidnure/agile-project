import { Component } from '@angular/core';
import {IProductQueryParameters} from '../../interfaces/product.interface';
import {Router} from '@angular/router';
import {ICategory} from '../../interfaces/category.interface';

@Component({
  selector: 'app-popular-products-page',
  templateUrl: './popular-products-page.component.html',
  styleUrls: ['./popular-products-page.component.scss']
})
export class PopularProductsPageComponent {
    public show = false;
    public params = {isPopular: true};

    constructor(private router: Router) {
    }

    ngOnInit(): void {
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

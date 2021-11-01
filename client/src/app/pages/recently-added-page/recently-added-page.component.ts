import {Component} from '@angular/core';
import {IProductQueryParameters} from '../../interfaces/product.interface';
import {ICategory} from '../../interfaces/category.interface';
import {Router} from '@angular/router';


@Component({
    selector: 'app-recently-added-page',
    templateUrl: './recently-added-page.component.html',
    styleUrls: ['./recently-added-page.component.scss']
})
export class RecentlyAddedPageComponent {
    public show = false;
    public params: IProductQueryParameters = {
        isRecentlyAdded: true,
        page: 0,
        amount: 10
    };

    constructor(private router: Router) {
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

import {Component, OnInit} from '@angular/core';
import {ICategory} from '../../interfaces/category.interface';
import {Router} from '@angular/router';

@Component({
    selector: 'app-admin-manage-category-list',
    templateUrl: './admin-manage-category-list.component.html',
    styleUrls: ['./admin-manage-category-list.component.scss']
})
export class AdminManageCategoryListComponent implements OnInit {

    constructor(private router: Router) {
    }

    ngOnInit(): void {
    }

    handleManageCategory(category: ICategory) {
        if (category && category.id) {
            const extras = {state: {categoryToUpdate: category}};
            this.router.navigateByUrl(`/admin/categories/${category.id}`, extras);
        }
    }
}

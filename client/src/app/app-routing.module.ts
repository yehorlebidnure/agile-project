import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ProductCategoryPage} from './pages/product-category-page/product-category-page';
import {ProductDetailPage} from './pages/product-detail-page/product-detail-page';
import {AuthenticationPageComponent} from './pages/authentication-page/authentication-page.component';
import {MainPageComponent} from './pages/main-page/main-page.component';
import {RecentlyAddedPageComponent} from './pages/recently-added-page/recently-added-page.component';
import {PopularProductsPageComponent} from './pages/popular-products-page/popular-products-page.component';
import {CartPageComponent} from './pages/cart-page/cart-page.component';
import {AdminManageProductPageComponent} from './pages/admin-manage-product-page/admin-manage-product-page.component';
import {NotFoundPageComponent} from './pages/not-found-page/not-found-page.component';
import {AdminGuard} from './guards/admin.guard';
import {CustomerGuard} from './guards/customer.guard';
import {GhostGuard} from './guards/ghost.guard';
import {AdminManageCategoryComponent} from './pages/admin-manage-category/admin-manage-category.component';
import {AdminManageCategoryListComponent} from './pages/admin-manage-category-list/admin-manage-category-list.component';

const routes: Routes = [
    {path: '', pathMatch: 'full', component: MainPageComponent},
    {path: 'authentication', canActivate: [GhostGuard], component: AuthenticationPageComponent,},
    {path: 'newest', pathMatch: 'full', component: RecentlyAddedPageComponent,},
    {path: 'popular', pathMatch: 'full', component: PopularProductsPageComponent,},
    {path: 'categories/:categoryId', pathMatch: 'full', component: ProductCategoryPage,},
    {path: 'products/:categoryId', pathMatch: 'full', component: ProductDetailPage,},
    {path: 'cart', canActivate: [CustomerGuard], pathMatch: 'full', component: CartPageComponent},
    {
        path: 'admin', canActivate: [AdminGuard], canActivateChild: [AdminGuard], children: [
            {path: 'newProduct', component: AdminManageProductPageComponent, data: {type: 'create'}},
            {path: 'newCategory', component: AdminManageCategoryComponent, data: {type: 'create'}},
            {path: 'categories', component: AdminManageCategoryListComponent,},
            {path: 'categories/:categoryId', component: AdminManageCategoryComponent, data: {type: 'update'}},
            {path: 'products/:productId', component: AdminManageProductPageComponent, data: {type: 'update'}},
        ]
    },
    {path: '**', component: NotFoundPageComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}

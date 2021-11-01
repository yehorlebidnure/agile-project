import {IProduct, IProductImage, IProductOrderSelect} from '../interfaces/product.interface';
import {ICategory} from '../interfaces/category.interface';

export class Product implements IProduct {
    category: ICategory;
    createdAt: number;
    description: string;
    id: number;
    image: IProductImage;
    isPromo: boolean;
    price: number;
    title: string;

    static getOrderOptions(): IProductOrderSelect[] {
        return [
            {name: 'Select order', value: 0, isSelected: true},
            {name: 'By title', value: 1, field: 'title', isDesc: false,},
            {name: 'By title desc', value: 2, field: 'title', isDesc: true},
            {name: 'By price', value: 3, field: 'price', isDesc: false},
            {name: 'By price desc', value: 4, field: 'price', isDesc: true},
            {name: 'By date', value: 5, field: 'created_at', isDesc: false},
            {name: 'By date desc', value: 6, field: 'created_at', isDesc: true},
        ];
    }

    /**
     * getter for parameters
     */
    static get parametersToCompare(): string[] {
        return ['title', 'price', 'description', 'isPromo', 'category'];
    }

    /**
     * compare products
     * @param prev
     * @param next
     */
    static compare(prev: IProduct, next: IProduct): boolean {
        let isEqual = true;
        Product.parametersToCompare.forEach(parameter => {
            if (parameter === 'category') {
                if (prev[parameter].id != next[parameter].id) {
                    isEqual = false;
                }
            }
            else {
                if (prev[parameter] != next[parameter]) {
                    isEqual = false;
                }
            }
        });
        return isEqual;
    }
}

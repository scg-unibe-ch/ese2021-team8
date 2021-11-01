import {Category} from '../models/category.model';

export class CategoryService {
    public getCategory(id: number): Promise<Category> {
        return Category.findByPk(id)
            .then(result => {
                if (result) {
                    return Promise.resolve(result);
                } else {
                    return Promise.reject('The category does not exist!');
                }
            })
            .catch(() => Promise.reject('could not fetch the category!'));
    }
}

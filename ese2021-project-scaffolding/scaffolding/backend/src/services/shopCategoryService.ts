import {ShopCategory} from '../models/shopCategory.model';

export class ShopCategoryService {
    public getCategory(id: number): Promise<ShopCategory> {
        return ShopCategory.findByPk(id)
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

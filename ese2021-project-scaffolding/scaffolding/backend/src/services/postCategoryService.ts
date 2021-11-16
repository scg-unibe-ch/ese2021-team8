import {PostCategory} from '../models/postCategory.model';

export class PostCategoryService {
    public getCategory(id: number): Promise<PostCategory> {
        return PostCategory.findByPk(id)
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

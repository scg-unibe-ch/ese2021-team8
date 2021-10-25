import {Category} from "./category.model";
import {User} from "./user.model";

export class Post{
  constructor(
  //  public postId: number,
    public title: string,
    public category: Category | undefined,
    public content: string,
    public creator: User | undefined, //allow undefined for now
    public date: Date
  ) {
  }
}

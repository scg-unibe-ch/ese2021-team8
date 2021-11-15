
export class Post{
  constructor(
    public postId: number,
    public title: string,
    public categoryId: number,
    public content: string,
    public creatorId: number,
    public date: Date,
    public votes: number,
    public itemImage: boolean
  ) {
  }
}

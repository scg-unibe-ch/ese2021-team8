export class Product{

  constructor(
    public productId: number,
    public title: string,
    public shopCategoryId: number,
    public description: string,
    public price: number,
    public productImage: boolean,
  ) {}
}


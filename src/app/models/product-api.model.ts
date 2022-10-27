export interface ProductAPI {
  id:          string;
  title:       string;
  price:       number;
  description: string;
  category:    Category;
  images:      string[];
  taxes?: number;
}

export interface Category {
  id: number;
  name: string;
  typeImg: string;
}

export interface ProductCreateDTO extends Omit<ProductAPI, 'id' | 'category'> {
  categoryId: number;
}

export interface ProductUpdateDTO extends Partial<ProductAPI> {
  categoryId?: number;
}

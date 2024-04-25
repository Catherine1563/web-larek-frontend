import { Product } from "../components/common/Product";

export interface ProductInter {
  image: string;
  title:string;
  price: string;
  category: string;
  description: string;
}

export interface ICatalog{
  catalog: ProductInter[];
  addProduct(product: Product): void;
}
export interface IModal {
  buttonClose: HTMLButtonElement;
  open(): void;
  close(): void;
}

export interface IBasket {
  list: Product[];
  total: number;
}

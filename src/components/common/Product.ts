import { IProductItem } from "../../types";
import { Model } from "../base/Model";
export class Product extends Model<IProductItem> {
  category: string;
  description: string;
  id: string;
  image: string;
  title: string;
  price: number;
  isAddBasket: boolean;

  clearisAddBasket() {
    this.isAddBasket = false;
}

  set _isAddBasket(value: boolean){
    this.isAddBasket = value;
  }
  get _isAddBasket(): boolean {
    return this.isAddBasket;
}
}
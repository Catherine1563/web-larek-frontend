
import { IBasket } from "../../types";
import { Product } from "./Product";

export class Basket implements IBasket {
  list: Product[];
  total: number  = 0;

  constructor(list: Product[] = []) {
    this.list = list;
  }

  addList(it: Product): void {
    let check: boolean = true;
    this.list.forEach(item => {
      if(item === it){
        check = false;
      }
    });
    if(it !== null && check){
      this.list.push(it);
      const kol = document.querySelector('.header__basket-counter');
      kol.textContent = String(this.list.length);
    }
  }

  deleteProductList(item: Product){
    this.list = this.list.filter(product => product !== item);
    const kol = document.querySelector('.header__basket-counter');
    kol.textContent = String(this.list.length);
  }

  totalPrice(){
    this.list.forEach(item => {
      if(item.price === null){
        this.total += 0;
      }
      else {
        this.total += Number(item.price);
      }
    });
  }
}
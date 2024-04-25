import { ProductInter } from "../../types";


export class Product implements ProductInter {
  id: string;
  image: string;
  title: string;
  price: string;
  category: string;
  description: string;

  constructor() {}

  renderProduct(id: string,title: string, category: string, image: string, price: string, description: string): void {
    this.id = id;
    this.title = title; 
    this.category = category; 
    this.image = image;
    this.price = price;
    this.description = description;
  }

}
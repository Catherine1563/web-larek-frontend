import { ICatalog } from "../../types";
import { cloneTemplate } from "../../utils/utils";
import { IEvents } from "../base/events";
import { Basket } from "./Basket";
import { Product } from "./Product";
import { ModalProduct } from "./View";


export class Catalog implements ICatalog {
    catalog: Product[] = [];

  constructor(protected events: IEvents){};

  addProduct(product: Product): void {
      this.catalog.push(product);
  }
}

export class CatalogAddPage {
  constructor(protected container: HTMLElement){};

  renderCatalog( products: Product[], modal: ModalProduct, basket: Basket, baseUrl: string) {
    const items: HTMLElement[] = [];
    products.forEach((product) => {
      const template = document.getElementById('card-catalog') as HTMLTemplateElement;
      const cardElement = cloneTemplate(template);

      cardElement.querySelector('.card__category').textContent = product.category;
      cardElement.querySelector('.card__title').textContent = product.title;
      if(product.price === null){
        cardElement.querySelector('.card__price').textContent = 'Бесценно';
      }
      else {
        cardElement.querySelector('.card__price').textContent = product.price + ' синапсов';
      }
      cardElement.querySelector('.card__image').setAttribute('src', baseUrl + product.image);
      cardElement.addEventListener('click', () => {
        modal.open();
        modal.renderProductModal(product, basket, baseUrl);
      });
      items.push(cardElement);
    });
    this.container.append(...items);

    return this.container;
  }
}
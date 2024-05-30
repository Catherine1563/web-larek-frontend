import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { ICardActions } from "./Card";

export interface IBasketCard {
  title: string;
  price: number;
  index: string;
}

export class BasketCard extends Component<IBasketCard> {
  protected _index: HTMLElement;
  protected _title: HTMLElement;
  protected _price: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
      super(container);
      this._index = ensureElement<HTMLElement>(`.basket__item-index`, container);
      this._title = ensureElement<HTMLElement>(`.card__title`, container);
      this._price = ensureElement<HTMLImageElement>(`.card__price`, container);
      this._button = ensureElement<HTMLButtonElement>(`.basket__item-delete`, container);
      if (actions?.onClick) {
        if (this._button) {
            this._button.addEventListener('click', actions.onClick);
        } else {
            container.addEventListener('click', actions.onClick);
        }
      }
  }

  set index(value: string) {
      this.setText(this._index, value);
  }

  get index(): string {
      return this._index.textContent || '';
  }

  set title(value: string) {
      this.setText(this._title, value);
  }

  get title(): string {
      return this._title.textContent || '';
  }

  set price(value: string) {
      if(value === null){
          this.setText(this._price, 'Бесценно');
      }
      else{
          this.setText(this._price, value + ' синапсов');
      }
    }
  
    get price(): string {
        return this._price.textContent || '';
  }
}
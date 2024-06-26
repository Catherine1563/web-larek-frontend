import { Events } from "../../types";
import { createElement, ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { EventEmitter } from "../base/events";

interface IBasketView {
  items: HTMLElement[];
  total: number;
  selected: string[];
}

export class Basket extends Component<IBasketView> {
  protected _list: HTMLElement;
  protected _total: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: EventEmitter) {
      super(container);

      this._list = ensureElement<HTMLElement>('.basket__list', this.container);
      this._total = ensureElement<HTMLElement>('.basket__price', this.container);
      this._button = ensureElement<HTMLButtonElement>('.basket__button', this.container);
      this.setDisabled(this._button, true);

      if (this._button) {
          this._button.addEventListener('click', () => {
              events.emit(Events.ORDER_OPEN);
          });
      }

      this.items = [];
  }

  set items(items: HTMLElement[]) {
    if (items.length) {
        this._list.replaceChildren(...items);
    } else {
        this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
            textContent: 'Корзина пуста'
        }));
    }
}

  set selected(items: number) {
      if (items === 0) {
        this.setDisabled(this._button, true);
      } else {
        this.setDisabled(this._button, false);
      }
  }

  set total(total: number) {
      this.setText(this._total, total + ' синапсов');
  }

  get button(): HTMLButtonElement{
    return this._button;
  }
}
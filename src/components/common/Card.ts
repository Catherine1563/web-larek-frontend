import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { Product } from "./Product";

export type CatalogChangeEvent = {
  catalog: Product[]
};

export interface ICardActions {
  onClick: (event: MouseEvent) => void;
}

export interface ICard<T> {
  title: string;
  description?: string | string[];
  image?: string;
  category?: string;
  price: number;
  isAddBasket: boolean;
}

export class Card<T> extends Component<ICard<T>> {
  protected _title: HTMLElement;
  protected _image?: HTMLImageElement;
  protected _description?: HTMLElement;
  protected _category?: HTMLElement;
  protected _price: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
      super(container);

      this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
      this._image = ensureElement<HTMLImageElement>(`.${blockName}__image`, container);
      this._category = ensureElement<HTMLElement>(`.${blockName}__category`, container);
      this._price = ensureElement<HTMLImageElement>(`.${blockName}__price`, container);
      this._description = container.querySelector(`.${blockName}__text`);
      this._button = container.querySelector(`.${blockName}__button`);
      if (actions?.onClick) {
        if (this._button) {
            this._button.addEventListener('click', actions.onClick);
        } else {
            container.addEventListener('click', actions.onClick);
        }
    }
  }

  set id(value: string) {
      this.container.dataset.id = value;
  }

  get id(): string {
      return this.container.dataset.id || '';
  }

  set title(value: string) {
      this.setText(this._title, value);
  }

  get title(): string {
      return this._title.textContent || '';
  }

  
  set category(value: string) {
    this.setText(this._category, value);
  }

  get category(): string {
      return this._category.textContent || '';
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

  set image(value: string) {
      this.setImage(this._image, value, this.title)
  }

  set description(value: string | string[]) {
      if (Array.isArray(value)) {
          this._description.replaceWith(...value.map(str => {
              const descTemplate = this._description.cloneNode() as HTMLElement;
              this.setText(descTemplate, str);
              return descTemplate;
          }));
      } else {
          this.setText(this._description, value);
      }
  }

  get button(): HTMLButtonElement{
    return this._button;
  }
}
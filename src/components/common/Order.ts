import { Events, IOrderForm } from "../../types";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { Form } from "./Form";

export class Order extends Form<IOrderForm> {
  protected _buttonOnline: HTMLButtonElement;
  protected _buttonOffline: HTMLButtonElement;

  constructor(container: HTMLFormElement, events: IEvents) {
      super(container, events);
      this._buttonOnline = ensureElement<HTMLButtonElement>('button[name=card]', this.container);
      this._buttonOffline = ensureElement<HTMLButtonElement>('button[name=cash]', this.container); 
      this._buttonOnline.addEventListener('click', () => {
          this.updateButtonsState(true,false);
      });

      this._buttonOffline.addEventListener('click', () => {
          this.updateButtonsState(false,true);
      });

  }

  updateButtonsState(online: boolean, offline: boolean) {
      this._buttonOnline.disabled = online;
      this._buttonOffline.disabled = offline;
  
      this.events.emit(Events.ORDER_BUTTONS_CHANGE, { online, offline });
  }

  set address(value: string) {
      (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
  }

  set buttonOnline(value: boolean){
      this._buttonOnline.disabled = value;
  }

  set buttonOffline(value: boolean){
      this._buttonOffline.disabled = value;
  }
}
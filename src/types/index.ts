export type FormErrors = Partial<Record<keyof IOrder, string>>;

export type ApiListResponse<Type> = {
  total: number,
  items: Type[]
};

export interface IProductItem {
  id: string;
  title: string;
  category: string;
  description?: string;
  image: string;
  price: number;
}

export interface IAppState {
  catalog: IProductItem[];
}
export interface IOrderForm {
  payment: string;
  address: string;
}

export interface IContactsForm {
  email: string;
  phone: string;
}
export interface IOrder extends IOrderForm, IContactsForm {
  total: number,
  items: string[]
}
export interface IOrderResult {
  id: string;
}

export enum Events {
  ITEMS_CHANGED = 'items:changed',
  CARD_SELECT = 'card:select',
  BASKET_OPEN = 'basket:open',
  BASKET_DELETE = 'basket:delete',
  BASKET_ADD = 'basket:add',
  PREVIEW_CHANGED = 'preview:changed',
  FORMERRORSORDER_CHANGED = 'formErrorsOrder:change',
  ORDER_CHANGE = 'order:change',
  ORDER_BUTTONS_CHANGE = 'order:buttons:change',
  ORDER_OPEN = 'order:open',
  ORDER_READY = 'order:ready',
  FORMERRORSCONTACTS_CHANGE = 'formErrorsContacts:change',
  CONTACTS_CHANGE = 'contacts:change',
  ORDER_SUBMIT = 'order:submit',
  CONTACTS_SUBMIT = 'contacts:submit',
  MODAL_OPEN = 'modal:open',
  MODAL_CLOSE = 'modal:close',
}
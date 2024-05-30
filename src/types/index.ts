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
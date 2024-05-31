import { Events, FormErrors, IAppState, IContactsForm, IOrder, IOrderForm, IProductItem } from "../../types";
import { Model } from "../base/Model";
import { Basket } from "./Basket";
import { Page } from "./Page";
import { Product } from "./Product";

export class AppState extends Model<IAppState> {
  catalog: Product[];
  preview: string | null;
  formErrors: FormErrors = {};
  order: IOrder = {
    payment: '',
    email: '',
    phone: '',
    address: '',
    total: 0,
    items: []
};

  setCatalog(items: IProductItem[]) {
      this.catalog = items.map(item => new Product(item, this.events));
      this.emitChanges(Events.ITEMS_CHANGED, { catalog: this.catalog });
  }

  setPreview(item: Product) {
    this.preview = item.id;
    this.emitChanges(Events.PREVIEW_CHANGED, item);
}
getProducts(): Product[] {
    return this.catalog.filter(item => item.isAddBasket === true);
}
getTotal(items: Product[]): number {
    let total = 0;
    this.order.items = [];
    items.forEach(item => {
        this.order.items.push(item.id);
        console.log(item.price);
        total += item.price;
    });
    this.order.total = total;
    return total;
}

clearBasket(page: Page, basket: Basket) {
    page.counter = 0;
    this.order.items.forEach(id => {
        this.catalog.find(it => it.id === id).clearisAddBasket();
    });
    this.order.items = [];
    basket.items = [];
    basket.total = 0;
    basket.button.disabled = true;
}

setOrderButtons(online: boolean, offline: boolean) {
    if(online){
        this.order.payment = 'card';
    }
    else if (offline){
        this.order.payment = 'cash';
    }
    else {
        this.order.payment = '';
    }
}

setOrderField(field: keyof IOrderForm, value: string) {
    this.order[field] = value;

    if (this.validateOrder()) {
        this.events.emit(Events.ORDER_READY, this.order);
    }
}

validateOrder() {
    const errors: typeof this.formErrors = {};
    if (!this.order.address) {
        errors.address = 'Необходимо указать адрес';
    }
    if(!this.order.payment){
        errors.payment = 'Нужно выбрать способ оплаты';
    }
    this.formErrors = errors;
    this.events.emit(Events.FORMERRORSORDER_CHANGED, this.formErrors);
    return Object.keys(errors).length === 0;
}

setContactsField(field: keyof IContactsForm, value: string) {
    this.order[field] = value;

    if (this.validateContacts()) {
        this.events.emit(Events.ORDER_READY, this.order);
    }
}

validateContacts() {
    const errors: typeof this.formErrors = {};
    if (!this.order.email) {
        errors.email = 'Необходимо указать email';
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(this.order.email)) {
        errors.email = 'Email не должен содержать кириллических букв и должен содержать символ "@" и символ "."';
    }
    if (!this.order.phone) {
        errors.phone = 'Необходимо указать телефон';
    } else if (/[^0-9 ]/.test(this.order.phone)) {
        errors.phone = 'Телефон не должен содержать букв и специальных символов';
    }
    this.formErrors = errors;
    this.events.emit(Events.FORMERRORSCONTACTS_CHANGE, this.formErrors);
    return Object.keys(errors).length === 0;
}
}
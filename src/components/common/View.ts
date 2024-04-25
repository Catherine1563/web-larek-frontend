import { API_URL, ApiResponses, CDN_URL } from "../..";
import { cloneTemplate } from "../../utils/utils";
import { Basket } from "./Basket";
import { Modal } from "./Modal";
import { Product } from "./Product";
import { Validation } from "./Validation";

export class BasketView {

  render(data: {products: Product[]}, modal: ModalBasket, basket: Basket){
    modal.renderBasketClear(basket);
    if(data.products.length === 0){
      modal.open();
    }
    else {
        modal.renderBasket({list: data.products}, basket);
        modal.open();
    }
  }
}

export class ModalProduct extends Modal{
  constructor(protected container:HTMLElement){
    super(container);
  }

  renderProductModal(product: Product, basket: Basket, baseUrl: string ) {
    this.container.querySelector('.card__category').textContent = product.category;
    this.container.querySelector('.card__title').textContent = product.title;
    if(product.price === null){
      this.container.querySelector('.card__price').textContent = 'Бесценно';
    }
    else {
      this.container.querySelector('.card__price').textContent = product.price + ' синапсов';
    }
    this.container.querySelector('.card__image').setAttribute('src', baseUrl + product.image);
    this.container.querySelector('.card__text').textContent = product.description;
    this.container.addEventListener('click', (evt) => {
      if((evt.target as HTMLButtonElement).className === 'button'){
        basket.addList(product);
        product= null;
        this.close();
      }
      product= null;
    });
    return this.container;
  }
}

export class ModalBasket extends Modal {

  totalFinel: HTMLElement
  buttonDesign: HTMLButtonElement
  contentList: HTMLElement

  constructor(protected container:HTMLElement){
    super(container);
    this.totalFinel = this.container.querySelector('.basket__price') as HTMLElement;
    this.buttonDesign = this.container.querySelector('.button') as HTMLButtonElement;
    this.contentList = this.container.querySelector('.basket__list') as HTMLElement;
  }

  renderBasketClear(basket: Basket){
    this.buttonDesign.disabled = true;
    basket.total = 0;
    this.totalFinel.textContent = String(basket.total) + ' синапсов';
    while(this.contentList.firstChild){
      this.contentList.removeChild(this.contentList.firstChild);
    }
  }

  renderBasket( data: {list: Product[]}, basket: Basket){
    const template = document.getElementById('card-basket') as HTMLTemplateElement;
    let id: number = 1;
    this.buttonDesign.disabled = false;
    data.list.forEach((item) => {
      const cardElement = cloneTemplate(template);
      const buttonDelete = cardElement.querySelector('.basket__item-delete');
      cardElement.querySelector('.basket__item-index').textContent = String(id);
      cardElement.querySelector('.card__title').textContent = item.title;
      if(item.price === null){
        cardElement.querySelector('.card__price').textContent = 'Бесценно';
      }
      else {
        cardElement.querySelector('.card__price').textContent = item.price + ' синапсов';
      }
      buttonDelete.addEventListener('click', () => {
        this.contentList.removeChild(cardElement);
        basket.deleteProductList(item);
      });
      this.contentList.appendChild(cardElement);
      id++;
    });
    basket.totalPrice();
    this.totalFinel.textContent = String(basket.total) + ' синапсов';
    this.buttonDesign.addEventListener('click', (evt) => {
      const modalElements = document.querySelectorAll('.modal');
      const treeModalElement = modalElements[3] as HTMLElement;
      const modal = new ModalFormAddress(treeModalElement);
      evt.preventDefault();
      modal.renderFormAdress(basket);
      this.close();
    });

    return this.container;
  }
}

export class ModalFormAddress extends Modal {
  constructor(protected container:HTMLElement){
    super(container);
  }

  renderFormAdress( basket: Basket){
    const modalElements = document.querySelectorAll('.modal');
    const treeModalElement = modalElements[3] as HTMLElement;
    const modal = new Modal(treeModalElement);
    modal.open();

    const formList = Array.from(document.querySelectorAll('.form')) as HTMLElement[];
    const valid = new Validation();
    formList.forEach((formElement) => {
        formElement.addEventListener('submit', (evt) => {
            evt.preventDefault();
        });
        formList.forEach((item) => {
            valid.setEventListeners(item);
        });
    });
    const buttons = treeModalElement.querySelectorAll('.button');
    const buttonNext = buttons[2] as HTMLButtonElement;
    const buttonOnline = buttons[0] as HTMLButtonElement;
    const buttonUponReceipt = buttons[1] as HTMLButtonElement;

    buttonOnline.addEventListener('click', () => {
      buttonOnline.disabled = true;
      buttonUponReceipt.disabled = false;
    });

    buttonUponReceipt.addEventListener('click', () => {
      buttonOnline.disabled = false;
      buttonUponReceipt.disabled = true;
    });

    buttonNext.addEventListener('click', (evt) => {
      evt.preventDefault();
      const inputAddress = formList[0].querySelector('.form__input') as HTMLInputElement;
      const fourModalElement = modalElements[4] as HTMLElement;
      const modal = new ModalFormUser(fourModalElement);
      modal.renderFormUser(basket, inputAddress.value);
      this.close();
      buttonOnline.disabled = false;
      buttonUponReceipt.disabled = false;
      valid.clearValidation(formList[0]);
    });
  }
}

export class ModalFormUser extends Modal {

  constructor(protected container:HTMLElement){
    super(container);
  };

  renderFormUser( basket: Basket, address: String){
    const modalElements = document.querySelectorAll('.modal');
    const fourModalElement = modalElements[4] as HTMLElement;
    const modal = new Modal(fourModalElement);
    modal.open();
    const buttonNext = fourModalElement.querySelector('.button') as HTMLButtonElement;
    const formList = Array.from(document.querySelectorAll('.form')) as HTMLElement[];
    const valid = new Validation();
    buttonNext.addEventListener('click', (evt) => {
      evt.preventDefault();
      const inputAddress = formList[1].querySelectorAll('.form__input');
      const email = inputAddress[0] as HTMLInputElement;
      const phone = inputAddress[1] as HTMLInputElement;
      const fiveModalElement = modalElements[5] as HTMLElement;
      const modal = new ModalSuccsess(fiveModalElement);
      modal.renderSucsses(basket,address,email.value,phone.value);
      this.close();
      valid.clearValidation(formList[1]);
    });
  }
}

export class ModalSuccsess extends Modal {

  constructor(protected container:HTMLElement){
    super(container);
  };

  renderSucsses( basket: Basket, address: String, email: string, phone: string){
    const api = new ApiResponses(CDN_URL,API_URL);
    const idProducts: String[] = [];
    const modalElements = document.querySelectorAll('.modal');
    const fiveModalElement = modalElements[5] as HTMLElement;
    const modal = new Modal(fiveModalElement);
    const buttonOrderSuccess = fiveModalElement.querySelector('.order-success__close') as HTMLButtonElement;
    const totalFinel = fiveModalElement.querySelector('.film__description');
    modal.open();
    totalFinel.textContent = 'Списано ' + String(basket.total) + ' синапсов';
    basket.list.forEach(item => {
      idProducts.push(item.id);
      basket.deleteProductList(item);
    });
    let obj = {};
    if(basket.total === null){
       obj = {
        payment: 'online',
        email: email,
        phone: phone,
        address: address,
        total: 0,
        items: idProducts
      };
    }else{
       obj = {
        payment: 'online',
        email: email,
        phone: phone,
        address: address,
        total: basket.total,
        items: idProducts
      };
    }
    api.postOrder(obj);
    buttonOrderSuccess.addEventListener('click', () => {
      modal.close();
    });
  }
}
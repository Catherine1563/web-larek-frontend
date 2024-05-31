import { EventEmitter } from './components/base/events';
import { AuctionAPI } from './components/common/ActionAPI';
import { AppState } from './components/common/AppState';
import { Basket } from './components/common/Basket';
import { BasketCard } from './components/common/BasketCard';
import { Card, CatalogChangeEvent } from './components/common/Card';
import { Contacts } from './components/common/Contacts';
import { Modal } from './components/common/Modal';
import { Order } from './components/common/Order';
import { Page } from './components/common/Page';
import { Product } from './components/common/Product';
import { Success } from './components/common/Success';
import './scss/styles.scss';
import { Events, IContactsForm, IOrderForm } from './types';
import { cloneTemplate, createElement, ensureElement } from './utils/utils';

export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

//Template object
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// EvantEmited
const events = new EventEmitter();

// Connect API
const api = new AuctionAPI(CDN_URL,API_URL);

//Elements page
const page = new Page(document.body, events);
const appData = new AppState({}, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const contact = new Contacts(cloneTemplate(contactTemplate), events);

//Событие создание карточек и добавление их в каталог
events.on<CatalogChangeEvent>(Events.ITEMS_CHANGED, () => {
  page.catalog = appData.catalog.map(item => {
      const card = new Card('card', cloneTemplate(cardCatalogTemplate), {
          onClick: () => events.emit(Events.CARD_SELECT, item)
      });
      return card.render({
          title: item.title,
          image: item.image,
          category: item.category,
          price: item.price,
          isAddBasket: false
          
      });
  });
});

// Открытие карточки
events.on(Events.CARD_SELECT, (item: Product) => {
  appData.setPreview(item);
});

// Изменен открытый выбранный карточки
events.on(Events.PREVIEW_CHANGED, (item: Product) => {
    const showItem = (item: Product) => {
        const card = new Card('card', cloneTemplate(cardPreviewTemplate), {
          onClick: () => {
              item._isAddBasket = true;
              events.emit(Events.BASKET_ADD)
          }
        });
        modal.render({
            content: card.render({
                title: item.title,
                image: item.image,
                description: item.description,
                category: item.category,
                price: item.price
            })
        });
        if(card.price === 'Бесценно'){
          card.button.disabled = true;
        }
    };
  
    if (item) {
        api.getProductItem(item.id)
            .then((result) => {
                showItem(item);
            })
            .catch((err) => {
                console.error(err);
            })
    } else {
        modal.close();
    }
  });

// Открыть корзины
events.on(Events.BASKET_OPEN, () => {
    modal.render({
        content: createElement<HTMLElement>('div', {}, [
            basket.render()
        ])
    });
  });

// Добавление продукта в корзину
events.on(Events.BASKET_ADD, () => {
    let index = 1;
    page.counter = appData.getProducts().length;
    basket.items = appData.getProducts().map(item => {
        const card = new BasketCard(cloneTemplate(cardBasketTemplate), {
            onClick: () => events.emit(Events.BASKET_DELETE, item)
        });
        return card.render({
            index: String(index++),
            title: item.title,
            price: item.price,
        });
    });
    basket.selected = appData.getProducts().length;
    basket.total = appData.getTotal(appData.getProducts());
    modal.close();
  });

// Удаление продукта из корзины
events.on(Events.BASKET_DELETE, (item: Product) => {
    item._isAddBasket = false;
    events.emit(Events.BASKET_ADD);
});

// Изменилось состояние валидации формы
events.on(Events.FORMERRORSORDER_CHANGED, (errors: Partial<IOrderForm>) => {
    const { payment, address } = errors;
    order.valid = !address && !payment;
    order.errors = Object.values({payment, address}).filter(Boolean).join('; ');
});

// Изменилось одно из полей
events.on(Events.ORDER_CHANGE, (data: { field: keyof IOrderForm, value?: string }) => {
    appData.setOrderField(data.field, data.value);
});

// Изменилось кнопка выбора оплаты
events.on(Events.ORDER_BUTTONS_CHANGE, (data: { online: boolean, offline: boolean }) => {
    appData.setOrderButtons(data.online, data.offline);
});

// Открытие окна адреса
events.on(Events.ORDER_OPEN, () => {
    modal.render({
        content: order.render({
            payment: '',
            address: '',
            valid: false,
            errors: []
        })
    });
});

// Изменилось состояние валидации формы
events.on(Events.FORMERRORSCONTACTS_CHANGE, (errors: Partial<IContactsForm>) => {
    const { email, phone } = errors;
    contact.valid = !email && !phone;
    contact.errors = Object.values({email, phone}).filter(Boolean).join('; ');
});

// Изменилось одно из полей
events.on(Events.CONTACTS_CHANGE, (data: { field: keyof IContactsForm, value?: string }) => {
    appData.setContactsField(data.field, data.value);
});

// Открытие окна контактных данных
events.on(Events.ORDER_SUBMIT, () => {
    modal.render({
        content: contact.render({
            email: '',
            phone: '',
            valid: false,
            errors: []
        })
    });
});

// Отправлена форма заказа
events.on(Events.CONTACTS_SUBMIT, () => {
    api.orderProducts(appData.order)
        .then((result) => {
            const success = new Success(cloneTemplate(successTemplate), {
                onClick: () => {
                    modal.close();
                    appData.clearBasket(page, basket);
                }
            });

            modal.render({
                content: success.render({
                    total: appData.order.total
                })
            });
            appData.clearBasket(page, basket);
        })
        .catch(err => {
            console.error(err);
        });
});

// Блокируем прокрутку страницы если открыта модалка
events.on(Events.MODAL_OPEN, () => {
  page.locked = true;
});

// ... и разблокируем
events.on(Events.MODAL_CLOSE, () => {
  page.locked = false;
});

// Получение карточек из сервера
api.getProductList()
    .then(appData.setCatalog.bind(appData))
    .catch(err => {
        console.error(err);
    });


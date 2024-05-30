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
import { IContactsForm, IOrderForm } from './types';
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

events.onAll(({ eventName, data }) => {
  console.log(eventName, data);
})

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
events.on<CatalogChangeEvent>('items:changed', () => {
  page.catalog = appData.catalog.map(item => {
      const card = new Card('card', cloneTemplate(cardCatalogTemplate), {
          onClick: () => events.emit('card:select', item)
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
events.on('card:select', (item: Product) => {
  appData.setPreview(item);
});

// Открыть корзины
events.on('basket:open', () => {
    modal.render({
        content: createElement<HTMLElement>('div', {}, [
            basket.render()
        ])
    });
  });

// Удаление продукта из корзины
events.on('basket:delete', (item: Product) => {
    item._isAddBasket = false;
    events.emit('basket:add');
});

// Добавление продукта в корзину
events.on('basket:add', () => {
    let index = 1;
    page.counter = appData.getProducts().length;
    basket.items = appData.getProducts().map(item => {
        const card = new BasketCard(cloneTemplate(cardBasketTemplate), {
            onClick: () => events.emit('basket:delete', item)
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

// Изменен открытый выбранный карточки
events.on('preview:changed', (item: Product) => {
  const showItem = (item: Product) => {
      const card = new Card('card', cloneTemplate(cardPreviewTemplate), {
        onClick: () => {
            item._isAddBasket = true;
            events.emit('basket:add')
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

// Изменилось состояние валидации формы
events.on('formErrorsOrder:change', (errors: Partial<IOrderForm>) => {
    const { payment, address } = errors;
    order.valid = !address && !payment;
    order.errors = Object.values({payment, address}).filter(i => !!i).join('; ');
});

// Изменилось одно из полей
events.on(/^order*:change/, (data: { field: keyof IOrderForm, value?: string }) => {
    appData.setOrderField(data.field, data.value);
});

// Изменилось кнопка выбора оплаты
events.on('order:buttons:change', (data: { online: boolean, offline: boolean }) => {
    appData.setOrderButtons(data.online, data.offline);
});

// Открытие окна адреса
events.on('order:open', () => {
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
events.on('formErrorsContacts:change', (errors: Partial<IContactsForm>) => {
    const { email, phone } = errors;
    contact.valid = !email && !phone;
    contact.errors = Object.values({email, phone}).filter(i => !!i).join('; ');
});

// Изменилось одно из полей
events.on(/^contacts*:change/, (data: { field: keyof IContactsForm, value?: string }) => {
    appData.setContactsField(data.field, data.value);
});

// Открытие окна контактных данных
events.on('order:submit', () => {
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
events.on('contacts:submit', () => {
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
events.on('modal:open', () => {
  page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
  page.locked = false;
});

// Получение карточек из сервера
api.getProductList()
    .then(appData.setCatalog.bind(appData))
    .catch(err => {
        console.error(err);
    });


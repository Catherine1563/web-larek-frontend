# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
## Архитектура
UML-схема проекта "Веб-ларек"

![Web-ларек](https://github.com/Catherine1563/web-larek-frontend/assets/144515483/d5e758b4-ece1-42c8-95a8-a6ff8006c410)

## Базовый код

### 1. Класс Model
Абстрактный класс предназначен для расширения другого класса, путем добавление методов и переменных другого класса к классу, который расширяет.

Класс имеет такие методы:
1. ```emitChanges(string, object)``` - создает событие об изменении модели.

Данный класс относится к прикладному слой архитектуры.

### 2. Класс Api
Класс предназначен для реализации сохранение данных пользователя в БД и получение данных для реализации каталога и корзины.

Конструктор принимает такие аргументы:
1. ```baseURL: string``` - URL адрес сервера
2. ```option: RequestInit``` - опции для реализации работы с сервером

Класс имеет такие методы:
1. ```handleResponse(Response): void``` - проверка коректности работы сервера
2. ```get(string): void``` - получение данных с сревера
3. ```post(string, object, ApiPostMethods): void``` - добавление данными сервер

Данный класс относится к слой портов и адаптеров архитектуры.

### 3. Класс EventEmitter
Класс предназначен для реализации подписывания на события и уведомления подписчиков о наступлении события, а также использует паттерн "Наблюдатель" для реализации функционалов класса.

Конструктор принимает такие аргументы:
1. ```events: Map <string, Subscriber>``` - хранит в себе событие и ключ на него

Класс имеет такие методы:
1. ```on(string, Subscriber): void``` - устанавливает обработчик на события
2. ```off(string, Subscriber): void``` - убирает обработчик на события
3. ```emit(string, T): void``` - уведомление о наступлении событие
4. ```onAll(EmitterEvent): void``` - включение всех событий 
5. ```offAll(): void``` - выключение всех событий
6. ```trigger(string, Partial<T>): void``` - генерирует заданное событие с заданными аргументами

Также у класса есть интерфейс ```IEvents``` содержащий методы класса. Данный класс относится к прикладному слой архитектуры.

### 4. Класс Component
Абстрактный класс предназначен для работы с DOM элементами. Связывает классы с HTML элементами, а также имеет методы для изменения HTML элемента.

Конструктор принимает такие аргументы:
1. ```container: HTMLElement``` - HTML элемент

Класс имеет такие методы:
1. ```toggleClass(HTMLElement, string, boolean)``` - меняет класс элемента
2. ```setText(HTMLElement, unknown)``` - устанавлевает текст
3. ```setDisabled(HTMLElement, boolean)``` - блокирует кнопку
4. ```setHidden(HTMLElement)``` - прячит элемент 
5. ```setVisible(HTMLElement)``` - показывает скрытый элемент
6. ```setImage(HTMLImageElement, string, string)``` - устанавлевает картинку
7. ```render(Partial<T>): HTMLElement``` - предназначен для обновления элемента на странице

Данный класс относится к прикладному слой архитектуры.

## Компоненты модели данных (бизнес-логика)

### 1. Класс AuctionAPI
Класс предназначен для подключения к серверу, а также реализует получение и отправление данных.

Конструктор принимает такие аргументы:
1. ```cdn: string``` - переменная для загрузки с сервера

Класс имеет такие методы:
1. ```getProductItem(string): Promise<IProductItem>``` - получает по id нужный продукт
2. ```getProductList(): Promise<IProductItem[]>``` - получаем из сервера список продуктов
3. ```orderProducts(IOrder): Promise<IOrderResult>``` - отправка заказа на сервер

Также у класса есть интерфейс ```IAuctionAPI``` содержащий методы класса. Обращение к серверу происходит через событие. Данный класс относится к прикладному слой архитектуры.

### 2. Класс AppState
Класс предназначен для заполнение корзины продуктами, а также удаление продукта из корзины, подсчет финальной суммы товаров и очистка корзины после оформления. Также данный класс должен содержать несколько продуктов, а именно массив класса Product.

Конструктор принимает такие аргументы:

1. ```catalog: Product[]``` - массив продуктов
2. ```preview: string | null``` - хранит id просматриваемого продукта
3. ```formErrors: FormErrors``` - сообщение об ошибке
4. ```order: IOrder``` - обьект заказа содержащий данные о заказе

Класс имеет такие методы:
1. ```setCatalog(IProductItem[])```- устанавливает каталок
2. ```setPreview(Product)``` - устанавливает предварительный просмотор
3. ```getProducts(): Product[]``` - получение списка продуктов
4. ```getTotal(Product[]): number``` - получение общей суммы
5. ```clearBasket(Page, Basket)``` - очистка корзины
6. ```setOrderButtons(boolean, boolean)``` - установка способа оплаты в заказе
7. ```setOrderField(keyof IOrderForm, string)``` - установка значений заказа
8. ```validateOrder()``` - проверка ошибок в формах
9. ```setContactsField(keyof IContactsForm, string)``` - установка значений заказа
10. ```validateContacts()``` - проверка ошибок в формах

Также у класса есть интерфейс ```IAppState``` содержащий элементы класса. Установка каталога на страницу происходит через событие. Данный класс относится к прикладному слой архитектуры.

### 3. Класс Basket
Класс предназначен для отабражение корзины на страницы.

Конструктор принимает такие аргументы:
1. ```_list: HTMLElement``` - лист продуктов
2. ```_total: HTMLElement``` - общая сумма
3. ```_button: HTMLButtonElement``` - кнопка для перехода на форму заполнения заказа

Класс имеет такие методы:
1. ```set items(HTMLElement[])``` - установка листа продукта
2. ```set selected(number)``` - блакировка кнопки
3. ```set total(number)``` - установка общей суммы
4. ```get button(): HTMLButtonElement``` - получение кнопки

Также у класса есть интерфейс ```IBasketView``` содержащий элементы класса. Переход на форму заказа происходит через событие. Данный класс относится к доменному слой архитектуры.

### 4. Класс BasketCard
Класс предназначен для реализации карточки в корзине и удаление продукта из корзины.

Конструктор принимает такие аргументы:
1. ```_index: HTMLElement``` - номер карточки в списке
2. ```_title: HTMLElement``` - название карточки
3. ```_price: HTMLElement``` - цена карточки
4. ```_button: HTMLButtonElement``` - кнопка удаления

Класс имеет такие методы:
1. ```set index(string)```, ```set title(string)```, ```set price(string)``` - установка значений
2. ```get index(): string```, ```get title(): string```, ```get price(): string``` - получение значений

Также у класса есть интерфейс ```IBasketCard``` содержащий элементы класса.
Удаление карточки происходит через события. Данный класс относится к прикладному слой архитектуры.

### 5. Класс Card<T>
Класс предназначен для реализации карточек на странице.

Конструктор принимает такие аргументы:
1. ```_title: HTMLElement``` - название карточки
2. ```_image: HTMLImageElement``` - картинка карточки
3. ```_description: HTMLElement``` - описание карточки
4. ```_category: HTMLElement``` - категория карточки
5. ```_price: HTMLElement``` - цена карточки
6. ```_button: HTMLButtonElement``` - кнопка добавление в корзину

Класс имеет такие методы:
1. ```set id(string)```, ```set title(string)```, ```set category(string)```, ```set price(string)```, ```set image(string)```, ```set description(string | string[])``` - установка значений
2. ```get id(): string```, ```get title(): string```, ```get category(): string```, ```get price(): string```, ```get button(): HTMLButtonElement``` - получение значений

Также у класса есть интерфейс ```ICard<T>``` содержащий элементы класса. Добавление карточки в корзину происходит через события. Данный класс относится к прикладному слой архитектуры.

### 6. Класс Contacts
Класс предназначен для реализации формы контактных данных покупателя.

Класс имеет такие методы:
1. ```set phone(string)```, ```set email(string)``` - установка значений

Также у класса есть интерфейс ```IContactsForm``` содержащий элементы класса. Проверка на корректность данных происходит через события. Данный класс относится к доменному слой архитектуры.

### 7. Класс Form<T>
Класс предназначен для отображение формы на странице, реализацию кнопки отправки, установки значений.

Конструктор принимает такие аргументы:
1. ```_submit: HTMLButtonElement``` - кнопка отправки
2. ```_errors: HTMLElement``` - сообщение ошибки

Класс имеет такие методы:
1. ```onInputChange(keyof T, string)``` - изменение полей формы
2. ```set valid(boolean)```, ```set errors(string)``` - установка значений
3. ```render(Partial<T> & IFormState)``` - обнавление формы

Также у класса есть интерфейс ```IFormState``` содержащий элементы класса. Изменение полей и отправку данных или открытие новой формы происходит через события. Данный класс относится к прикладному слой архитектуры.

### 8. Класс Modal
Класс предназначен для реализации модальных окон на странице.

Конструктор принимает такие аргументы:
1. ```_closeButton: HTMLButtonElement``` - кнопка закрытие
2. ```_content: HTMLElement``` - контент модального окна

Класс имеет такие методы:
1. ```set content(HTMLElement)``` - установка значений
2. ```open()``` - открытие модального окна
3. ```close()``` - закрытие модального окна
4. ```render(IModalData): HTMLElement``` - обновление модального окна

Также у класса есть интерфейс ```IModalData``` содержащий элементы класса. Закрытие и открытие окна происходит через события. Данный класс относится к прикладному слой архитектуры.

### 9. Класс Order
Класс предназначен для реализации формы заказа, а также отабражения на странице.

Конструктор принимает такие аргументы:
1. ```_buttonOnline: HTMLButtonElement``` - кнопка оплатить онлайн
2. ```_buttonOffline: HTMLButtonElement``` - кнопка оплатить наличными

Класс имеет такие методы:
1. ```updateButtonsState(boolean, boolean)``` - блокировка кнопок при выборе оплаты
2. ```set address(string)```, ```set buttonOnline(boolean)```, ```set buttonOffline(boolean)``` - установка значений

Также у класса есть интерфейс ```IOrderForm``` содержащий элементы класса. Проверка на корректность данных происходит через события. Данный класс относится к доменному слой архитектуры.

### 10. Класс Page
Класс предназначен для реализации главной страницы, подсчет количества товаров в корзине, открытие корзины, установка каталога на страницу, блокировка прокрутки страницы при открытии модального окна.

Конструктор принимает такие аргументы:
1. ```_counter: HTMLElement``` - количество товаров в корзине
2. ```_catalog: HTMLElement``` - каталог на странице
3. ```_wrapper: HTMLElement``` - блокировка прокрутки
4. ```_basket: HTMLElement``` - корзина на странице

Класс имеет такие методы:
1. ```set counter(number)```, ```set catalog(HTMLElement[])```, ```set locked(boolean)``` - установка значений

Также у класса есть интерфейс ```IPage``` содержащий элементы класса. Открытие корзины происходит через события. Данный класс относится к прикладному слой архитектуры.

### 11. Класс Product
Класс предназначен для описание характеристик продукта.

Конструктор принимает такие аргументы:
1. ```category: string``` - категория продукта
2. ```description: string``` - описание продукта
3. ```id: string``` - id продукта
4. ```image: string``` - картинка продукта
5. ```title: string``` - название продукта
6. ```price: number``` - цена продукта
7. ```isAddBasket: boolean``` - была ли нажата кнопка добавление продукта в корзину

Класс имеет такие методы:
1. ```clearisAddBasket()``` - очистка переменной isAddBasket
2. ```set _isAddBasket(boolean)``` - установка значения
3. ```get _isAddBasket(): boolean``` - получение значения
Также у класса есть интерфейс ```IProductItem``` содержащий элементы класса. Данный класс относится к доменному слой архитектуры.

### 12. Класс Success
Класс предназначен для реализации модального окна успешного заказа.

Конструктор принимает такие аргументы:
1. ```_close: HTMLElement``` - кнопка на главную
2. ```_total: HTMLElement``` - общая сумма

Класс имеет такие методы:
1. ```set total(number)``` - установка значения

Также у класса есть интерфейс ```ISuccess``` содержащий элементы класса. Данный класс относится к доменному слой архитектуры.

## Ключевые типы данных
```ts
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
```

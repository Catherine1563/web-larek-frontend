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

![Web-ларек-пример](https://github.com/Catherine1563/web-larek-frontend/assets/144515483/541205b7-0e7d-4e13-9b0b-dbdebd2f8668)

## Базовый код

### 1. Класс Product
Класс предназначен для создание и заполнение карточек и модальных окон контентом, а также для получение цены карточки, чтобы использовать для подсчета в корзине общей суммы списков продуктов.

Конструктор принимает такие аргументы:
1. ```image: string``` - url ссылка на кртинку продукта
2. ```title: string``` -  название продукта
3. ```price: number``` - цена продукта
4. ```category: string``` - категория продукта
5. ```description: string``` - описание продукта
6. ```id: string``` - id продукта

Класс имеет такие методы:
1. ```renderProduct(string,string,string,string,string,string): void``` - для редактирование карточки продукта.

Также у класса есть интерфейс ```ProductInter``` содержащий элементы входящие в контент продукта.
Заполнение карточки продукта происходит путем взятия из Api нужных данных. Данный класс относится к доменному слой архитектуры. 

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

Данный класс относится к прикладному слой архитектуры.

## Компоненты модели данных (бизнес-логика)

### 1. Класс Ctalog
Класс предназначен для заполнение каталога продуктами и для размещения каталога на главной странице.

Конструктор принимает такие аргументы:
1. ```catalog: Product[]``` - массив классов Product 

Класс имеет такие методы:
1. ```addProduct(Product): void``` - для заполнение каталога продуктами

Также у класса есть интерфейс ```ICatalog``` содержащий элементы входящие в контент каталога. Данный класс относится к доменному слой архитектуры.

### 2. Класс Basket
Класс предназначен для заполнение корзины продуктами, а также удаление продукта из корзины, подсчет финальной суммы товаров и очистка корзины после оформления. Также данный класс должен содержать несколько продуктов, а именно массив класса Product.

Конструктор принимает такие аргументы:

1. ```list: Product[]``` - лист продуктов для оформления
2. ```total: number``` - общая сумма продуктов

Класс имеет такие методы:
1. ```addList(Product): void``` - для добавление продукта в лист
2. ```deleteProductList(Product): void``` - для удаление продукта из листа
3. ```totalPrice(): void``` - для подсчета общей суммы в корзине
4. 
Также у класса есть интерфейс ```IBasket``` содержащий элементы входящие в контент каталога. Удаление продукта из корзины происходит через событие. Данный класс относится к доменному слой архитектуры.

### 3. Класс ApiResponses
Класс предназначен для получение информации о пользователе при оформлении заказа.

Конструктор принимает такие аргументы:
1. ```readonly cdn: string;``` - кнопка "онлайн" оплаты

Класс имеет такие методы:
1. ```getListProduct(Catalog): Promise<Catalog>``` - для получения продуктов с сервера
2. ```postOrder(object): void``` - для отправки на сервер данные об оплате

Данный класс относится к слой портов и адаптеров архитектуры.

### 4. Класс Modal
Класс предназначен для реализации функционала вснх модальных окон и заполнеии их контентом.

Конструктор принимает такие аргументы:
1. ```buttonClose: HTMLButtonElement``` - кнопка закрытия окна

Класс имеет такие методы:
1. ```close(): void``` - для закрытие окна
2. ```open(): void``` - для открытие окна

Также у класса есть интерфейс ```IModal``` содержащий элемент контента модального окна.
Открытие и закрытие модального окна происходит через события. Данный класс относится к доменному слой архитектуры.

### 5. Класс Validation
Класс предназначен для реализации проверки форм на наличие ошибок и вывод этих ошибок.

Класс имеет такие методы:
1. ```setEventListeners(HTMLElement): void``` - установка событий на форму
2. ```checkInputValidity(HTMLElement, HTMLInputElement): void``` - проверка на валидацию
3. ```showInputError(HTMLElement,HTMLInputElement, string): void``` - показ сообщения об ошибке
4. ```hideInputError(HTMLElement, HTMLInputElement): void``` - скрытие сообщения об ошибке
5. ```hasInvalidInput(HTMLInputElement[]): boolean``` - возвращение проверки на правельный ввод
6. ```toggleButtonState(HTMLInputElement[], HTMLButtonElement): void``` - менятие состояния кнопки
7. ```сlearValidation(HTMLElement): void``` -очистка input

Очистка input, проверка на ошибки и установка сообщения об ошибке происходит через события. Данный класс относится к прикладному слой архитектуры.

### 6. Класс ModalBasket
Класс предназначен для реализации проверки форм на наличие ошибок и вывод этих ошибок.

Конструктор принимает такие аргументы:
1. ```totalFinel: HTMLElement``` - финальная цена
2. ```buttonDesign: HTMLButtonElement``` - кнопка оформление заказа
3. ```contentList: HTMLElement``` - лист корзины

Класс имеет такие методы:
1. ```renderBasketClear(Basket): void``` - очистка корзины
2. ```renderBasket( data: {Product[]}, Basket): void``` - редактирование контента в модальное окно корзины

Данный класс относится к прикладному слой архитектуры.

### 7. Класс BasketView
Класс предназначен для реализации проверки форм на наличие ошибок и вывод этих ошибок.

Класс имеет такие методы:
1. ```render(data: {Product[]}, ModalBasket,Basket): void``` - установка контента в модальное окно корзины

Данный класс относится к прикладному слой архитектуры.

### 8. Класс ModalProduct
Класс предназначен для реализации проверки форм на наличие ошибок и вывод этих ошибок.

Класс имеет такие методы:
1. ```renderProductModal(Product, Basket, string ): void``` - установка контента модального окна карточки

Данный класс относится к прикладному слой архитектуры.

### 9. Класс ModalSuccsess
Класс предназначен для реализации проверки форм на наличие ошибок и вывод этих ошибок.

Класс имеет такие методы:
1. ```renderSucsses( Basket, String, string, string): void``` - установка модального окна об успехе

Данный класс относится к прикладному слой архитектуры.

### 10. Класс ModalFormUser
Класс предназначен для реализации проверки форм на наличие ошибок и вывод этих ошибок.

Класс имеет такие методы:
1. ```renderFormUser( Basket, String): void``` - установка модального окна данных о пользователе

Данный класс относится к прикладному слой архитектуры.

### 11. Класс ModalFormAddress
Класс предназначен для реализации проверки форм на наличие ошибок и вывод этих ошибок.

Класс имеет такие методы:
1. ```renderFormAdress( Basket): void``` - установка модального окна адрес и оплаты

Данный класс относится к прикладному слой архитектуры.

### 12. Класс CatalogAddPage
Класс предназначен для реализации проверки форм на наличие ошибок и вывод этих ошибок.

Класс имеет такие методы:
1. ```renderCatalog( Product[], ModalProduct, Basket, string): void``` - установка каталога на страницу

Данный класс относится к прикладному слой архитектуры.

## Ключевые типы данных
```ts
export interface ProductInter {
  image: string;
  title:string;
  price: string;
  category: string;
  description: string;
}

export interface ICatalog{
  catalog: ProductInter[];
  addProduct(product: Product): void;
}
export interface IModal {
  buttonClose: HTMLButtonElement;
  open(): void;
  close(): void;
}

export interface IBasket {
  list: Product[];
  total: number;
}
```

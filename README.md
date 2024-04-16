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

![Web-ларек](https://github.com/Catherine1563/web-larek-frontend/assets/144515483/d0d9f2ef-cb22-417b-aca7-155fb82a25c0)

## Базовый код

### 1. Класс Product
Класс предназначен для создание и заполнение карточек и модальных окон контентом, а также для получение цены карточки, чтобы использовать для подсчета в корзине общей суммы списков продуктов.

Конструктор принимает такие аргументы:
1. ```image: string``` - url ссылка на кртинку продукта
2. ```title: string``` -  название продукта
3. ```price: number``` - цена продукта
4. ```category: string``` - категория продукта
5. ```description: string``` - описание продукта

Класс имеет такие методы:
1. ```setImage(string):void```, ```setTitle(string):void```, ```setCategory(string):void```, ```setPrice(number):void```, ```setDescription(string):void``` - для установки значений в HTMLElement.
2. ```getPrice():number```, ```getTitle():string```, ```getImage():string```, ```getCategory():string``` - для получения значений

Также у класса есть интерфейс ```ProductInter``` содержащий элементы входящие в контент продукта.

### 2. Класс Api
Класс предназначен для реализации сохранение данных пользователя в БД и получение данных для реализации каталога и корзины.

Конструктор принимает такие аргументы:
1. ```baseURL: string``` - URL адрес сервера
2. ```option: RequestInit``` - опции для реализации работы с сервером

Класс имеет такие методы:
1. ```handleResponse(Response): void``` - проверка коректности работы сервера
2. ```get(string): void``` - получение данных с сревера
3. ```post(string, object, ApiPostMethods): void``` - добавление данными сервер

### 3. Класс EventEmitter
Класс предназначен для позволяет подписываться на события и уведомлять подписчиков о наступлении события.

Конструктор принимает такие аргументы:
1. ```events: Map <string, Subscriber>``` - хранит в себе событие и ключ на него

Класс имеет такие методы:
1. ```on(string, Subscriber): void``` - устанавливает обработчик на события
2. ```off(string, Subscriber): void``` - убирает обработчик на события
3. ```emit(string, T): void``` - уведомление о наступлении событие
4. ```onAll(EmitterEvent): void``` - включение всех событий 
5. ```offAll(): void``` - выключение всех событий
6. ```trigger(string, Partial<T>): void``` - генерирует заданное событие с заданными аргументами 

## Компоненты модели данных (бизнес-логика)

### 1. Класс Ctalog
Класс предназначен для заполнение каталога продуктами и для размещения каталога на главной странице.

Конструктор принимает такие аргументы:
1. ```catalog: Product[]``` - массив классов Product 

Класс имеет такие методы:
1. ```fillСatalog(Product): void``` - для заполнение каталога продуктами
2. ```getCatalog(): Product[]``` - для получение католога с продуктами

### 2. Класс Basket
Класс предназначен для заполнение корзины продуктами, а также удаление продукта из корзины, подсчет финальной суммы товаров и очистка корзины после оформления.

Конструктор принимает такие аргументы:
1. ```buttonDesign: HTMLButtonElement``` - кнопка оформление заказа
2. ```buttonDelete: HTMLButtonElement``` - кнопка удаление товара
3. ```list: Product[]``` - лист продуктов для оформления
4. ```total: number``` - общая сумма продуктов

Класс имеет такие методы:
1. ```setTotal(number): void```, ```setListProduct(Product[]): void``` - для установки значений
2. ```getTotal(): number```, ```getListProduct(): Product[]``` - для получение значений
3. ```deleteProduct(Product): void``` - для удаление продукта из корзины
4. ```clearBasket(Product[]): void``` - для очистки корзины
5. ```totalCost(number): void``` - для подсчета общей суммы

### 3. Класс User
Класс предназначен для получение информации о пользователе при оформлении заказа.

Конструктор принимает такие аргументы:
1. ```buttonOnline: HTMLButtonElement``` - кнопка "онлайн" оплаты
2. ```buttonUponReceipt: HTMLButtonElement``` - кнопка "при выдачи" оплаты 
3. ```paymentMethod: string``` - переменная для определение способа оплаты
4. ```address: string``` - адресс пользователя
5. ```email: string``` - почта пользователя
6. ``` phone: number``` - телефон пользователя

Класс имеет такие методы:
1. ```getAddress(): string```, ```getEmail(): string```, ```getPhone(): number``` - для получения значений
2. ```determinePaymentMethod(string): void``` - для определения способы оплаты

Также у класса есть интерфейс ```UserInter``` содержащий элементы данных пользователя при оформлении заказа.

### 4. Класс Modal
Класс предназначен для реализации функционала вснх модальных окон и заполнеии их контентом.

Конструктор принимает такие аргументы:
1. ```buttonClose: HTMLButtonElement``` - кнопка закрытия окна
2. ```buttonBuy: HTMLButtonElement``` - кнопка покупки
3. ```content: ModalInter``` - контент окна

Класс имеет такие методы:
1. ```close(): void``` - для закрытие окна
2. ```open(): void``` - для открытие окна
3. ```setContent(HTMLElement): void``` - для заполнение окна контентом

Также у класса есть интерфейс ```ModalInter``` содержащий элемент контента модального окна.

### 5. Класс Validation
Класс предназначен для реализации проверки форм на наличие ошибок и вывод этих ошибок.

Конструктор принимает такие аргументы:
1. ```errors: HTMLElement``` - элемент вывода сообщения об ошибке
2. ```submit: HTMLButtonElement``` - кнопка перехода на другое модальное окно
3. ```input: HTMLElement``` - форма заполнения
4. ```valid: boolean``` - переменная для определение есть ли в форме ошибка
5. ```errorMessanger: string[]``` - сообщении об ошибке

Класс имеет такие методы:
1. ```reset(): void``` - сброс форм
2. ```setErrorMessanger(string, HTMLElement): void``` - установка сообщения об ошибке
3. ```checkValidation(boolean): void``` - проверка формы на ошибку

Также у класса есть интерфейс ```ValidationInter``` содержащий элементы валидации.

## Ключевые типы данных
```
type catalog = Product[]; //Католог продуктов
type list = Product[]; //Лист продуктов дабавленный в корзину
type total = number; // Цена продукта
type baseURL = string; // Адрес сервера
type button = HTMLButtonElement; //Кнопка на странице
type content = HTMLElement; //Контент в модальном окне

//Содержимое карточки продукта
interface ProductInter {
  image: string; //URL-ссылка на картинку продукта
  title: string; //Название продукта
  price: number; //Цена продукта
  category: string; //Категория продукта
  description: string; //Описание продукта
}

//Содержимое форм пользователя при оформлении заказа
interface UserInter {
  paymentMethod: string; //Способ оплаты
  address: string; //Адрес пользователя
  email: string; //Почта пользователя
  phone: number; //Телефон рользователя
}

enum Events {
  DELETE_PRODUCT = 'basket:delet-product' //Удаление продукта {basket, product}
  CLOSE_MODAL = 'modal:close-modal' //Закрытие модального окна {modal}
  OPEN_MODAL = 'modal:open-modal' //Открытие модального окна {modal}
  CLEAR_INPUT = 'validation:clear-input' //Очистка инпута {validation, input}
  SET_ERROR_MESSANGER = 'validation:set-error-messanger' //Установка сообщения об ошибке {validation, span}
  CHECK_CORRECT = 'validation:check-correcr' //Проверка инпута на ошибку {validation, input}
}
```

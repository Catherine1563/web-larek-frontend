import { Api } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { Basket } from './components/common/Basket';
import { Catalog, CatalogAddPage } from './components/common/Catalog';
import { Product } from './components/common/Product';
import { BasketView, ModalBasket, ModalProduct } from './components/common/View';
import './scss/styles.scss';
import { ProductInter } from './types';


export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

interface ProductResponse {
  total: number;
  items: Product[]; 
}
export class ApiResponses extends Api {
  readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    async getListProduct(catalogs: Catalog): Promise<Catalog>{
      await this.get('/product/').then((data: ProductResponse) => {
        data.items.forEach((item) => {
           catalogs.addProduct(item);
        });

      })
      return catalogs;
    }

     postOrder(listProduct: object){
       this.post('/order', listProduct).then((data) => {
        console.log(data);
      });
    }
}

const events = new EventEmitter();

events.onAll(({ eventName, data }) => {
  console.log(eventName, data);
})

const api = new ApiResponses(CDN_URL,API_URL);

const catalogs = new Catalog(events);
const basketView = new BasketView();
const basket = new Basket();
const modalElements = document.querySelectorAll('.modal');
const oneModalElement = modalElements[1] as HTMLElement;
const secondModalElement = modalElements[2] as HTMLElement;
const modalProduct = new ModalProduct(oneModalElement);
const modalBasket = new ModalBasket(secondModalElement);
const buttonBasket = document.querySelector('.header__basket') as HTMLButtonElement;
const catalogView = new CatalogAddPage(document.querySelector('.gallery'));


api.getListProduct(catalogs).then(res => {
  catalogView.renderCatalog(catalogs.catalog, modalProduct, basket, CDN_URL);
});

buttonBasket.addEventListener('click', () => {
  basketView.render({products: basket.list}, modalBasket, basket);
});
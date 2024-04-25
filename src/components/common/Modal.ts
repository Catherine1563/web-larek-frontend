import { IModal } from "../../types";


export class Modal implements IModal{
  buttonClose: HTMLButtonElement;

  constructor(protected container:HTMLElement){
    this.buttonClose = this.container.querySelector('.modal__close') as HTMLButtonElement;
    this.buttonClose.addEventListener('click', this.close.bind(this));
    this.container;
  }

  open(){
    this.container.classList.add('modal_active');
  }

  close(){
    this.container.classList.remove('modal_active');
  }
}


export class Validation {

  setEventListeners(formElement: HTMLElement){
    const inputList = Array.from(formElement.querySelectorAll('.form__input')) as HTMLInputElement[];
    const buttonElement = formElement.querySelector('div[class="modal__actions"] .button') as HTMLButtonElement;
    this.toggleButtonState(inputList, buttonElement);
    inputList.forEach((inputElement) => {
        inputElement.addEventListener('input', () => {
            this.checkInputValidity(formElement, inputElement);
            this.toggleButtonState(inputList, buttonElement);
        });
    });
  }
  checkInputValidity(formElement: HTMLElement, inputElement: HTMLInputElement) {
    if (inputElement.validity.patternMismatch) {
        inputElement.setCustomValidity(inputElement.dataset.errorMessage);
    } else {
        inputElement.setCustomValidity("");
    }
    if (!inputElement.validity.valid) {
        this.showInputError(formElement, inputElement, inputElement.validationMessage);
    } else {
        this.hideInputError(formElement, inputElement);
    }
  }
  showInputError(formElement: HTMLElement, inputElement: HTMLInputElement, errorMessage: string){
    const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
    errorElement.textContent = errorMessage;
  }

  hideInputError(formElement: HTMLElement, inputElement: HTMLInputElement){
    const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
    errorElement.textContent = '';
  }
  hasInvalidInput(inputList: HTMLInputElement[]): boolean{
    return inputList.some((inputElement) => {
        return !inputElement.validity.valid;
    });
  }
  toggleButtonState(inputList: HTMLInputElement[], buttonElement: HTMLButtonElement){
    if (this.hasInvalidInput(inputList)) {
        buttonElement.disabled = true;
    } else {
        buttonElement.disabled = false;
    }
  }

  clearValidation(formElement: HTMLElement) {
    const inputList = formElement.querySelectorAll('.form__input') as NodeListOf<HTMLInputElement>;
    const buttonForm = formElement.querySelector('div[class="modal__actions"] .button') as HTMLButtonElement;
    inputList.forEach((item) => {
        this.hideInputError(formElement, item);
        item.value = '';
    });
    buttonForm.disabled = true;
  }
}
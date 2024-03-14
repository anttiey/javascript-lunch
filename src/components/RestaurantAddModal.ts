import Component from './Component';
import RestaurantRepository from '../domain/RestaurantRepository';
import { $ } from '../utils/dom';
import { isEmptyInput } from '../utils/validation';
import { ERROR } from '../constants/Message';

class RestaurantAddModal extends Component {
  static observedAttributes = ['open'];

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    this.render();
    this.setEvent();

    if (newValue) {
      this.#updateModal(JSON.parse(newValue));
    }
  }

  setEvent() {
    this.addEventListener('click', (event) => {
      if ((event.target as HTMLElement).classList.contains('button--secondary')) {
        this.#updateModal(false);
      }
    });

    this.addEventListener('submit', (event) => {
      if ((event.target as HTMLElement).classList.contains('modal-form')) {
        this.#onSubmit(event);
      }
    });
  }

  #updateModal(isOpen: boolean) {
    if (isOpen) {
      $(this, '.modal').classList.add('modal--open');
    } else {
      $(this, '.modal').classList.remove('modal--open');
    }
  }

  #onSubmit(event: Event) {
    event.preventDefault();

    if (this.#handleEmptyError(['.modal-category', '.modal-restaurant-name', '.modal-distance'])) {
      return;
    }

    this.#addRestaurant();

    ($(this, '.modal-form') as HTMLFormElement).reset();
    this.#updateModal(false);
  }

  #addRestaurant() {
    const formData = {
      category: ($(this, '.modal-category') as HTMLSelectElement).value as TCategory,
      name: ($(this, '.modal-restaurant-name') as HTMLInputElement).value,
      distance: Number(($(this, '.modal-distance') as HTMLSelectElement).value) as TDistance,
      description: ($(this, '.modal-description') as HTMLInputElement).value,
      reference: ($(this, '.modal-reference') as HTMLInputElement).value,
      isFavorite: false,
    };

    RestaurantRepository.addRestaurant(formData);

    this.makeCustomEvent('updateRestaurantList');
  }

  #handleEmptyError(selectors: string[]) {
    const errors = selectors.filter((selector) => {
      if (isEmptyInput(($(this, selector) as HTMLInputElement | HTMLSelectElement).value)) {
        $(this, `${selector}-error-message`).textContent = ERROR.NULL;
        return true;
      }

      $(this, `${selector}-error-message`).textContent = '';
      return false;
    });

    if (!errors.length) {
      return false;
    }

    ($(this, errors[0]) as HTMLInputElement | HTMLSelectElement).focus();
    return true;
  }

  template() {
    return `
          <div class="modal">
              <div class="modal-backdrop"></div>
              <div class="modal-container">
                  <h2 class="modal-title text-title">새로운 음식점</h2>
                  <form class="modal-form">
                      <div class="form-item form-item--required">
                          <label for="category text-caption">카테고리</label>
                          <filter-box type="modal-category"></filter-box>
                          <p class="modal-category-error-message"></p>
                      </div>
                      <div class="form-item form-item--required">
                          <label for="name text-caption">이름</label>
                          <input class="modal-restaurant-name" type="text" name="name" id="name" />
                          <p class="modal-restaurant-name-error-message"></p>
                      </div>
                      <div class="form-item form-item--required">
                          <label for="distance text-caption">거리(도보 이동 시간)</label>
                          <filter-box type="modal-distance"></filter-box>
                          <p class="modal-distance-error-message"></p>
                      </div>
                      <div class="form-item">
                          <label for="description text-caption">설명</label>
                          <textarea name="description" class="modal-description" id="description" cols="30" rows="5"></textarea>
                          <span class="help-text text-caption">메뉴 등 추가 정보를 입력해 주세요.</span>
                      </div>
                      <div class="form-item">
                          <label for="link text-caption">참고 링크</label>
                          <input type="text" name="reference" class="modal-reference" id="reference" />
                          <span class="help-text text-caption">매장 정보를 확인할 수 있는 링크를 입력해 주세요.</span>
                          <p class="modal-reference-error-message"></p>
                      </div>
                      <div class="button-container">
                          <button type="button" class="button button--secondary text-caption">취소하기</button>
                          <input type="submit" class="button button--primary text-caption" value="추가하기"></input>
                      </div>
                  </form>
              </div>
          </div>
      `;
  }
}

export default RestaurantAddModal;

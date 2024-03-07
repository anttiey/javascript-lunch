import { sampleRestaurants } from './data';

describe('점심 뭐 먹지 E2E 테스트', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080');
    cy.viewport(550, 950);
    localStorage.setItem('restaurants', JSON.stringify(sampleRestaurants));
  });

  it('새로운 음식점을 추가할 수 있다.', () => {
    cy.get('.gnb__button').click();

    cy.get('.modal-category').select('한식');
    cy.get('.modal-restaurant-name').type('파슬리와 썬데이의 삼겹살집');
    cy.get('.modal-distance').select('5');
    cy.get('.modal-description').type('파슬리와 썬데이가 장인 정신으로 한땀한땀 구워주는 삼겹살 맛집입니다.');
    cy.get('.modal-reference').type('https://www.woowacourse.io/');

    cy.get('.button--primary').click();

    cy.get('.restaurant').last().find('.restaurant__name').should('contain', '파슬리와 썬데이의 삼겹살집');
    cy.get('.restaurant').last().find('.restaurant__distance').should('contain', '5');
    cy.get('.restaurant')
      .last()
      .find('.restaurant__description')
      .should('contain', '파슬리와 썬데이가 장인 정신으로 한땀한땀 구워주는 삼겹살 맛집입니다.');
  });

  context('음식점을 카테고리 별로 필터링 할 수 있다.', () => {
    it('한식을 선택한 경우 카테고리가 한식인 음식점만 표시된다.', () => {
      cy.get('.category').select('한식');

      cy.get('.restaurant').find('.restaurant__name').should('contain', '파슬리네 김치찌개');
    });

    it('중식을 선택한 경우 카테고리가 중식인 음식점만 표시된다.', () => {
      cy.get('.category').select('중식');

      cy.get('.restaurant').find('.restaurant__name').should('contain', '파슬리네 짜장면');
    });

    it('양식을 선택한 경우 카테고리가 양식인 음식점만 표시된다.', () => {
      cy.get('.category').select('양식');

      cy.get('.restaurant').find('.restaurant__name').should('contain', '썬데이네 파스타');
    });

    it('일식을 선택한 경우 카테고리가 일식인 음식점만 표시된다.', () => {
      cy.get('.category').select('일식');

      cy.get('.restaurant').find('.restaurant__name').should('contain', '파슬리네 회전초밥');
    });

    it('아시안을 선택한 경우 카테고리가 아시안인 음식점만 표시된다.', () => {
      cy.get('.category').select('아시안');

      cy.get('.restaurant').find('.restaurant__name').should('contain', '썬데이네 쌀국수');
    });

    it('기타를 선택한 경우 카테고리가 기타인 음식점만 표시된다.', () => {
      cy.get('.category').select('기타');

      cy.get('.restaurant').find('.restaurant__name').should('contain', '썬데이네 반찬가게');
    });
  });
});

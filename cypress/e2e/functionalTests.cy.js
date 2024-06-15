import { faker } from '@faker-js/faker';

describe('Hotel Contact Form Submission Test', () => {

  // Generate random values for form input fields
  const generateRandomValue = (min, max, type = 'lorem') => {
    const length = faker.number.int({ min, max });
    if (type === 'numeric') {
      return faker.string.numeric(length);
    } else {
      return faker.lorem.text().slice(0, length);
    }
  };

  // Generated user data
  const user = {
    fullName: faker.person.fullName(),
    email: faker.internet.email(),
    phone: generateRandomValue(11, 21, 'numeric'),
    subject: generateRandomValue(5, 100),
    description: generateRandomValue(20, 2000),
  };

  // Functions to get hotel contact form elements
  const getName = () => cy.get('[data-testid="ContactName"]');
  const getEmail = () => cy.get('[data-testid="ContactEmail"]');
  const getPhone = () => cy.get('[data-testid="ContactPhone"]');
  const getSubject = () => cy.get('[data-testid="ContactSubject"]');
  const getDescription = () => cy.get('[data-testid="ContactDescription"]');
  const getSubmitButton = () => cy.get('#submitContact');
  const getAlert = () => cy.get('.alert-danger');


  it('Fills out the hotel contact form and submits it', () => {
    cy.intercept('POST', '/message').as('postMessage');
    cy.visit('/');

    getName().type(user.fullName);
    getEmail().type(user.email);
    getPhone().type(user.phone);
    getSubject().type(user.subject);
    getDescription().type(user.description);
    getSubmitButton().click();

    cy.wait('@postMessage').then((interception) => {
      expect(interception.response.statusCode).to.eq(201);
      expect(interception.request.body).to.deep.equal({
        name: user.fullName,
        email: user.email,
        phone: user.phone,
        subject: user.subject,
        description: user.description,
      });
    });
    cy.contains('h2',`Thanks for getting in touch ${user.fullName}!`).should('be.visible');
    cy.contains('p', user.subject).should('be.visible');
    getAlert().should('not.exist');
  });
});
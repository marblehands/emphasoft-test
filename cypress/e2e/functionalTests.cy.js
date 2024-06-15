import { faker } from '@faker-js/faker';

describe('Functional Tests', () => {
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

  it('Positive test: fills out the hotel contact form and submits it', () => {
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
    cy.contains('h2', `Thanks for getting in touch ${user.fullName}!`).should('be.visible');
    cy.contains('p', user.subject).should('be.visible');
    getAlert().should('not.exist');
  });

  const fillMandatoryFieldsExcept = (fieldToSkip) => {
    if (fieldToSkip !== 'name') {
      getName().type(user.fullName);
    }
    if (fieldToSkip !== 'email') {
      getEmail().type(user.email);
    }
    if (fieldToSkip !== 'phone') {
      getPhone().type(user.phone);
    }
    if (fieldToSkip !== 'subject') {
      getSubject().type(user.subject);
    }
    if (fieldToSkip !== 'description') {
      getDescription().type(user.description);
    }
  };

  it('Negative test: shows error when a mandatory field is not filled', () => {
    // Choice any field to skip from mandatory fields
    const mandatoryFields = ['name', 'email', 'phone', 'subject', 'description'];
    const fieldToSkip = faker.helpers.arrayElement(mandatoryFields);

    cy.intercept('POST', '/message').as('postMessage');
    cy.visit('/');
    fillMandatoryFieldsExcept(fieldToSkip);
    getSubmitButton().click();

    cy.wait('@postMessage').then((interception) => {
      expect(interception.response.statusCode).to.eq(400);
    });
    getAlert().should('be.visible');
    cy.contains('h2', `Thanks for getting in touch ${user.fullName}!`).should('not.exist');
    cy.contains('p', user.subject).should('not.exist');
  });

  const login = (role) => {
    const { username, password } = Cypress.env(role);
    cy.visit('/#/admin');
    cy.get('[data-testid="username"]').type(username);
    cy.get('[data-testid="password"]').type(password);
    cy.get('[data-testid="submit"]').click();
  };

  const allRoomFeatures = ['WiFi', 'TV', 'Radio', 'Refreshments', 'Safe', 'Views'];
  const room = {
    number: faker.number.int({ min: 0, max: 999 }).toString(),
    type: faker.helpers.arrayElement(['Single', 'Twin', 'Double', 'Family', 'Suite']),
    accessible: faker.helpers.arrayElement(['false', 'true']),
    price: faker.number.int({ min: 1, max: 999 }).toString(),
    features: faker.helpers.arrayElements(allRoomFeatures, faker.number.int({ min: 0, max: allRoomFeatures.length })),
  };

  // Functions to get room page elements
  const getRoomName = () => cy.get('[data-testid="roomName"]');
  const getRoomType = () => cy.get('#type');
  const getRoomAccessible = () => cy.get('#accessible');
  const getRoomPrice = () => cy.get('#roomPrice');
  const getFeatureCheckbox = (feature) => cy.get(`[value=${feature}]`);
  const getCreateRoomButton = () => cy.get('#createRoom');
  const getRoomList = () => cy.get('[data-testid="roomlisting"]');
  const getRoomDetails = () => cy.get('.room-details');

  it('Positive test: creates a room and validates result', () => {
    const checkRoomDetails = (room) => {
      cy.contains(room.number);
      cy.contains(room.type);
      cy.contains(room.accessible);
      cy.contains(room.price);
      room.features.forEach((feature) => {
        cy.contains(feature);
      });
    };

    cy.intercept('POST', '/room').as('createRoom');
    cy.intercept('GET', '/room').as('getRooms');
    login('admin');
    getRoomName().type(room.number);
    getRoomType().select(room.type);
    getRoomAccessible().select(room.accessible);
    getRoomPrice().type(room.price);
    room.features.forEach((feature) => {
      getFeatureCheckbox(feature).check();
    });
    getCreateRoomButton().click();

    cy.wait('@createRoom').then((interception) => {
      expect(interception.response.statusCode).to.eq(201);
      expect(interception.request.body).to.deep.include({
        roomName: room.number,
        type: room.type,
        accessible: room.accessible,
        roomPrice: room.price,
      });
      expect(interception.request.body.features).to.have.members(room.features);
    });
    cy.wait('@getRooms').its('response.statusCode').should('eq', 200);
    getRoomList()
      .last()
      .within(() => {
        checkRoomDetails(room);
      });
    getAlert().should('not.exist');
    getRoomList().last().click();
    cy.wait('@getRooms').its('response.statusCode').should('eq', 200);
    getRoomDetails().within(() => {
      checkRoomDetails(room);
    });
  });

  it('Negative test: should show an error message when adding a room with missing required fields randomly', () => {
    const fieldToSkip = faker.helpers.arrayElement(['number', 'price']);

    cy.intercept('POST', '/room').as('createRoom');
    cy.intercept('GET', '/room').as('getRooms');

    login('admin');
    if (fieldToSkip !== 'number') {
      getRoomName().type(room.number);
    }
    getRoomType().select(room.type);
    getRoomAccessible().select(room.accessible);
    if (fieldToSkip !== 'price') {
      getRoomPrice().type(room.price);
    }
    room.features.forEach((feature) => {
      getFeatureCheckbox(feature).check();
    });
    getCreateRoomButton().click();

    cy.wait('@createRoom').its('response.statusCode').should('eq', 400);
    cy.wait('@getRooms').its('response.statusCode').should('eq', 200);
    getAlert().should('be.visible');
  });
});

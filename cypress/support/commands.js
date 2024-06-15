Cypress.on('uncaught:exception', () => {
  return false;
});

Cypress.on('fail', (error) => {
  if (error.message.includes('NetworkError')) {
    return false;
  }
  throw error;
});
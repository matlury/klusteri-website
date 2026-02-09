import '../i18n';
import '@testing-library/jest-dom';

// Enable React act environment globally
global.IS_REACT_ACT_ENVIRONMENT = true;

// Mock scrollTo since it's not implemented in JSDOM
window.scrollTo = jest.fn();

// Mock window.location
const originalLocation = window.location;
delete window.location;
window.location = {
  ...originalLocation,
  reload: jest.fn(),
  assign: jest.fn(),
};

// If you need to track href changes, you can define it as a getter/setter
let href = originalLocation.href;
Object.defineProperty(window.location, 'href', {
  get: () => href,
  set: (newHref) => {
    href = newHref;
  },
  configurable: true,
});

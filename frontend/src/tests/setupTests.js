import '../i18n';
import '@testing-library/jest-dom';

// Enable React act environment globally
global.IS_REACT_ACT_ENVIRONMENT = true;

// Mock scrollTo since it's not implemented in JSDOM
window.scrollTo = jest.fn();

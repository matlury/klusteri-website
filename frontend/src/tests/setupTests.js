import '../i18n';
import '@testing-library/jest-dom';

// Mock scrollTo since it's not implemented in JSDOM
window.scrollTo = jest.fn();

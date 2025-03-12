import '@testing-library/jest-dom';

// Polyfill pour fetch et autres APIs du navigateur
import 'whatwg-fetch';
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder; 
import { setupServer } from 'msw/node';
import { manipuladoras } from './manipuladoras';

export const servidor = setupServer(...manipuladoras);
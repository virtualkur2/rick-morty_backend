import dotenv from 'dotenv';

dotenv.config();

export const RICK_AND_MORTY_API_BASE_URL = process.env.RICK_AND_MORTY_API_BASE_URL ?? 'https://rickandmortyapi.com/api';
export const RICK_AND_MORTY_DEFAULT_PAGE_SIZE = parseInt(process.env.RICK_AND_MORTY_DEFAULT_PAGE_SIZE ?? '20', 10);
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? '1d';
export const JWT_SECRET = process.env.JWT_SECRET ?? 'your_jwt_secret_key_please_change_this_in_production';
export const PORT = process.env.PORT || 3000;
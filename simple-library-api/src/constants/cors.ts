import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

// CORS Options for all requests (https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
export const CORS: CorsOptions = {
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: '*',
};
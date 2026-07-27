import { generateOpenApiDocument } from 'trpc-to-openapi';
import { appRouter } from './trpc';

export default generateOpenApiDocument(appRouter, {
   title: 'My API',
   version: '1.0.0',
   baseUrl: 'http://localhost/api'
});

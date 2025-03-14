import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import { DEFAULT_REDIRECT, PUBLIC_ROUTES, ROOT, LOGIN } from './src/lib/routes';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  

});

export const config = {
 matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
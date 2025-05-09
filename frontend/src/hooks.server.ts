import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  // Ignore requests starting with /api
  if (event.url.pathname.startsWith('/api')) {
    // Do nothing and let the backend handle it
    return;
  }

  // Let SvelteKit handle all other requests
  return resolve(event);
};
import type { Handle, HandleServerError } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }: {[x: string]: any}) => {
  // Ignore requests starting with /api
  if (event.url.pathname.startsWith('/api')) {
    // Do nothing and let the backend handle it
    return;
  }

  // Let SvelteKit handle all other requests
  return resolve(event);
};

export const handleError: HandleServerError = async ({ error, event, status, message }) => {
  if (status == 404) return;
};
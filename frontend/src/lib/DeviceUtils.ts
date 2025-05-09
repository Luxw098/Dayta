import Cookies from 'js-cookie';

export type LocalData = {
  timestamp: string,
  username: string
  chathash: string,
  channels: [{ channel: string, history: string }]
};

class DeviceUtils {
  static local_data = {
    get: (key: string) => {
      const value = localStorage.getItem(key);
      if (!value) return null
      const local_data = atob(value);
      return JSON.parse(local_data);
    },

    set: (key: string, value: any) => {
      const local_data = JSON.stringify(value);
      localStorage.setItem(key, btoa(local_data));
      return local_data;
    }
  };


  static cookies = {
    get: (key?: string) => {
      const cookies = Cookies.get();
      return (key) ? cookies[key] : cookies;
    },
    set: (key: string, value: string, options?: Cookies.CookieAttributes) => {
      return Cookies.set(key, value, options);
    }
  };
};
export default DeviceUtils;
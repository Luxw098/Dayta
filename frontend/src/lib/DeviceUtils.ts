import Cookies from 'js-cookie';

export type LocalData = {
  timestamp: string,
  username: string
  chathash: string,
  channels: [{ channel: string, history: string }]
};

class DeviceUtils {
  static local_data = {
    get: async (key: string) => {
      const local_data = localStorage.getItem(key);
      return local_data ? JSON.parse(local_data) : null;
    },

    set: async (key: string, value: any) => {
      const local_data = JSON.stringify(value);
      localStorage.setItem(key, local_data);
      return local_data;
    }
  };


  static cookies = {
    get: async () => {
      return Cookies.get();
    },
    set: async (key: string, value: string, options?: Cookies.CookieAttributes) => {
      return Cookies.set(key, value, options);
    }
  };
};
export default DeviceUtils;
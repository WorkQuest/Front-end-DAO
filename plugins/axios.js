/* eslint-disable no-param-reassign,consistent-return */
// eslint-disable-next-line func-names
import { Path } from '~/utils/enums';

// eslint-disable-next-line
export default function ({ $axios, store, app }, inject) {
  let isRefreshing = false;
  let failedQueue = [];
  $axios.onRequest((config) => {
    if (store.getters['user/isAuth'] && !config.url.includes('digitaloceanspaces.com')) {
      const urlName = config.url.split('/').pop();
      const token = urlName === 'refresh-tokens' ? store.getters['user/refreshToken'] : store.getters['user/accessToken'];
      config.headers.authorization = `Bearer ${token}`;
    }
  });
  // eslint-disable-next-line no-unused-vars
  $axios.onError(async (error) => {
    console.dir(error);
    const originalRequest = error.config;
    if (error.config.url === '/v1/auth/refresh-tokens') {
      await store.dispatch('user/logout');
      await app.$router.push(Path.SIGN_IN);
    } else if (error.response.status === 401) {
      const processQueue = (err, token = null) => {
        failedQueue.forEach((prom) => (err ? prom.reject(err) : prom.resolve(token)));
        failedQueue = [];
      };
      if (isRefreshing) {
        return new Promise(((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }))
          .then((token) => {
            originalRequest.headers.authorization = `Bearer ${token}`;
            return $axios(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }
      originalRequest._retry = true;
      isRefreshing = true;
      return new Promise(((resolve, reject) => {
        store.dispatch('user/refreshTokens')
          .then((data) => {
            originalRequest.headers.authorization = `Bearer ${data.result.access}`;
            processQueue(null, data.result.access);
            resolve($axios(originalRequest));
          })
          .catch((err) => {
            processQueue(err, null);
            reject(err);
          })
          .then(() => { isRefreshing = false; });
      }));
    } else if (error.response.data.code !== 400010) {
      await store.dispatch('main/showToast', {
        title: 'Error',
        text: error.response.data.msg,
      });
    }
    throw error;
  });
}

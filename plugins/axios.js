import { Path } from '~/utils/enums';

export default ({ $axios, store, app }) => {
  let isRefreshing = false;
  let isStopRequests = false;
  let refreshRequests = [];
  const withoutTokenRequests = ['login', 'register', 'validate-totp'];

  $axios.onRequest((config) => {
    const access = store.getters['user/accessToken'];
    const refresh = store.getters['user/refreshToken'];
    const isAuth = store.getters['user/isAuth'];

    if (isAuth && !config.url.includes('digitaloceanspaces.com')) {
      const urlName = config.url.split('/').pop();
      if (urlName === 'refresh-tokens') {
        config.headers.authorization = `Bearer ${refresh}`;
      } else {
        config.headers.authorization = `Bearer ${access}`;
      }
    }

    if (withoutTokenRequests.includes(config.url.split('/').pop())) {
      isStopRequests = false;
    }

    if (isStopRequests) {
      throw error;
    }
  });

  $axios.onResponse((response) => {
    const { config } = response;
    const isRefreshRequest = config.url.split('/').pop() === 'refresh-tokens';

    if (isRefreshRequest && response.status === 200) {
      store.commit('user/setTokens', {
        access: response.data.result.access,
        refresh: response.data.result.refresh,
      });
      isRefreshing = false;
      refreshRequests.forEach((req) => $axios(req));
      refreshRequests = [];
    }
  });

  $axios.onError(async (error) => {
    const originalRequest = error.config;
    if (app.$cookies.get('refresh')) {
      if ((error.response.status === 401 && originalRequest.url.split('/').pop() === 'refresh-tokens')) {
        isRefreshing = false;
        isStopRequests = true;
        refreshRequests = [];
        store.commit('user/logOut');
        redirect(Path.SIGN_IN);
        throw error;
      }

      if (error.response.status === 401 && !originalRequest._retry && !isRefreshing) {
        isRefreshing = true;
        originalRequest._retry = true;
        const responseRefresh = await store.dispatch('user/refreshTokens');
        if (responseRefresh && responseRefresh.ok) {
          return $axios(originalRequest);
        }
        return null;
      }

      if (isRefreshing) {
        refreshRequests.push(originalRequest);
      }
    } else if (error.response.data.code !== 400010) {
      await store.dispatch('main/showToast', {
        title: 'Error',
        text: error.response.data.msg,
      });
    }
    throw error;
  });
};

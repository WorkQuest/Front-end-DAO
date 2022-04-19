// eslint-disable-next-line func-names
import { Path } from '~/utils/enums';

// eslint-disable-next-line func-names
export default async function ({ app, redirect, store }) {
  try {
    const access = app.$cookies.get('access');
    const refresh = app.$cookies.get('refresh');
    const social = app.$cookies.get('socialNetwork');
    const userStatus = app.$cookies.get('userStatus');
    const userData = store.getters['user/getUserData'];
    const payload = {
      access, refresh, social, userStatus,
    };
    if (access) {
      store.commit('user/setTokens', payload);
    }
    if (!access || !app.$cookies.get('userLogin')) {
      await store.dispatch('user/logout');
      return redirect(Path.SIGN_IN);
    }
    if (!userData.id) {
      await store.dispatch('user/getUserData');
    }
    return true;
  } catch (e) {
    console.log(e);
    await store.dispatch('user/logout');
    return redirect('/sign-in');
  }
}

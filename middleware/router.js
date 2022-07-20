import { RouterNames } from '~/utils/enums';

// eslint-disable-next-line func-names
export default async function ({
  app, redirect, route,
}) {
  const access = app.$cookies.get('access');
  const redirectUrl = sessionStorage.getItem('redirectTo');
  if (!access && [RouterNames.SIGN_IN, RouterNames.SIGN_UP, RouterNames.ROLE, RouterNames.ROOT].includes(route.name) === false) {
    sessionStorage.setItem('redirectTo', route.path);
  } else if (access && redirectUrl) {
    redirect(redirectUrl);
    sessionStorage.removeItem('redirectTo');
  }
}

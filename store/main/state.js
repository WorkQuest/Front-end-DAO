import loaderModes from '~/store/main/loaderModes';

export default () => ({
  isLoading: false,
  loaderStatusText: null,
  loaderMode: loaderModes.default,
  isLoaderBackgroundHider: false,
  loaderProgress: 0,
  connections: {
    notifsConnection: false,
  },
});

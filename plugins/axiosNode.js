import ENV from '~/utils/addresses/index';

// eslint-disable-next-line
export default function ({ $axios, store }, inject) {
  const axiosNode = $axios.create({ baseURL: `${ENV.WQ_PROVIDER}api` });
  axiosNode.onError(async (error) => {
    throw error?.response?.data;
  });
  inject('axiosNode', axiosNode);
}

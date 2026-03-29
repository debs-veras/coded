import axios, { type AxiosInstance } from 'axios';
import { useUserStore } from './hooks/useUserStore';

const URL_API = import.meta.env.VITE_URL_API;

const getAxios = (timeout: number = 600000) => {
  const access = useUserStore.getState().user?.access;

  const instance: AxiosInstance = axios.create({
    baseURL: URL_API,
    timeout: timeout,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${access}`,
    },
  });

  return instance;
};

export default getAxios;

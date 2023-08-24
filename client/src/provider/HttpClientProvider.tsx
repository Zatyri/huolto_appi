import axios, { AxiosError, AxiosResponse } from 'axios';
import React, { createContext } from 'react';

export interface iHttpClient {
  getData: <T>(path: string) => Promise<Response<T>>;
  postData: <T, U>(path: string, body: T) => Promise<Response<U>>;
  putData: <T, U>(path: string, body: T) => Promise<Response<U>>;
  deleteData: <T>(path: string) => Promise<Response<T>>;
}

export type Response<T> = {
  isError: boolean;
  message?: string;
  result?: T;
};

const baseURL = process.env.REACT_APP_BASE_URL;

const initialHttpClient: iHttpClient = {
  getData: () => {
    throw new Error('GET not initialised yet');
  },
  postData: () => {
    throw new Error('POST not initialised yet');
  },
  putData: () => {
    throw new Error('PUT not initialised yet');
  },
  deleteData: () => {
    throw new Error('DELETE not initialised yet');
  },
};

const HttpClientContext = createContext<iHttpClient>(initialHttpClient);

const { Provider } = HttpClientContext;

export default function HttpClientProvider({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) {
  const httpClient = axios.create({
    baseURL: baseURL,
    timeout: 1000,
  });

  async function getData<T>(path: string): Promise<Response<T>> {
    return httpClient
      .get(path)
      .then(handleOnFulfilled<T>)
      .catch(handleOnReject<T>);
  }

  async function postData<T, U>(path: string, body: T): Promise<Response<U>> {
    return httpClient
      .post(path, body)
      .then(handleOnFulfilled<U>)
      .catch(handleOnReject<U>);
  }
  async function putData<T, U>(path: string, body: T): Promise<Response<U>> {
    return httpClient
      .put(path, body)
      .then(handleOnFulfilled<U>)
      .catch(handleOnReject<U>);
  }
  async function deleteData<T>(path: string): Promise<Response<T>> {
    return httpClient
      .delete(path)
      .then(handleOnFulfilled<T>)
      .catch(handleOnReject<T>);
  }
  return (
    <Provider value={{ getData, postData, putData, deleteData }}>
      {children}
    </Provider>
  );
}

function handleOnFulfilled<T>(response: AxiosResponse<any, any>): Response<T> {
  return { isError: false, result: response.data };
}

function handleOnReject<T>(reason: Error | AxiosError): Response<T> {
  if (axios.isAxiosError(reason)) {
    return {
      isError: true,
      message: reason.message,
      result: reason.response?.data ?? undefined,
    };
  } else {
    return { isError: true, message: 'An unexpected error occurred' };
  }
}

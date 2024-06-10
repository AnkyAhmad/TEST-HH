import axiosRequest from "../AxiosRequest";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getAllProyeks = async () => {
  const URL = BASE_URL + "/proyeks";
  const METHOD = "GET";
  return axiosRequest({ URL, METHOD });
};

export const createProyeks = async (payload) => {
  const URL = BASE_URL + "/proyeks";
  const METHOD = "POST";
  const DATA = payload;
  return axiosRequest({ URL, METHOD, DATA });
};

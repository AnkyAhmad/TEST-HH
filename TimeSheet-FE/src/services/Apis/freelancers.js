import axiosRequest from "../AxiosRequest";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const createKaryawan = async (payload) => {
  const URL = BASE_URL + "/freelancers";
  const METHOD = "POST";
  const DATA = payload;
  return axiosRequest({ URL, METHOD, DATA });
};

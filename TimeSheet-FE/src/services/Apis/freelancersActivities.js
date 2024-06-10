import axiosRequest from "../AxiosRequest";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const addActivitiesFreelancer = async (payload) => {
  const URL = BASE_URL + "/freelancers_activities";
  const METHOD = "POST";
  const DATA = payload;
  return axiosRequest({ URL, METHOD, DATA });
};

export const updateActivitiesFreelancer = async (uuid, payload) => {
  const URL = BASE_URL + `/freelancers_activities/${uuid}`;
  const METHOD = "PUT";
  const DATA = payload;
  return axiosRequest({ URL, METHOD, DATA });
};

export const deleteActivitiesFreelancer = async (uuid) => {
  const URL = BASE_URL + `/freelancers_activities/${uuid}`;
  const METHOD = "DELETE";
  return axiosRequest({ URL, METHOD });
};

import axios from "axios";

export default async function axiosRequest({ URL, METHOD, DATA }) {
  try {
    let HEADERS = {
      "Content-Type": "application/json"
    };

    const config = {
      url: URL,
      method: METHOD,
      headers: HEADERS
    };

    if (DATA !== undefined) {
      config.data = DATA;
    }

    const response = await axios(config);

    if (response.status < 200 || response.status >= 300) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    return response.data;
  } catch (error) {
    return error.response && typeof error.response.data === "object"
      ? error.response.data
      : { message: error.message, stack: error };
  }
}

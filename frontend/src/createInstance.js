import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { Promise } from 'mongoose';
const refreshToken = async () => {
  try {
    const res = await axios.post(
      '/api/v1/user/token/refresh',
      { withCredentials: true }
    );
    return res.data;
  } catch (err) {
    console.log(err);
  }
};
const createAxios = (user) => {
  const newInstance = axios.create();
  newInstance.interceptors.request.use(
    async (config) => {
      let date = new Date();
      const decodedToken = jwt_decode(user?.accessToken);
      if (decodedToken.exp < date.getTime() / 1000) {
        const data = await refreshToken();
      }
      return config;
    },
    (err) => {
      return Promise.reject(err);
    }
  );
};

export default createAxios;

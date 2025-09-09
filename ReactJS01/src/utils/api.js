import axios from './axios.customize';

export const createUserApi = (name, email, password, address, phone, age, gender, province) => {
    const data = { name, email, password, address, phone, age, gender, province };
    return axios.post("/v1/api/register", data);
};

export const loginApi = (email, password) => {
    return axios.post("/v1/api/login", { email, password });
};

export const getAccountApi = () => {
    return axios.get("/v1/api/account");
};

export const getUsersApi = (page = 1, pageSize = 10) => {
    return axios.get(`/v1/api/user?page=${page}&pageSize=${pageSize}`);
};

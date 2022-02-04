import axios from "axios";

export const instance = axios.create({
    baseURL: 'http://100.64.220.36:8000/api/',
});
import axios from "axios";

export const instance = axios.create({
    baseURL: 'http://192.168.0.105:8000/api/',
});
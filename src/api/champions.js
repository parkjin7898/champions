import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api/champions',
});

export const getChampions = async () => {
    const response = await api.get(``);
    return response.data;
};

export const getChampionDetail = async (englishName) => {
    const response = await api.get(`/${englishName}`);
    return response.data;
};

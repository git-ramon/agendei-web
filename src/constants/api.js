import axios from "axios";

const api  =  axios.create({
    baseURL: "https://agendei-api-kappa.vercel.app/"
});

export default api;
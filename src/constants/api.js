import axios from "axios";

const api  =  axios.create({
    baseURL: "https://agendei-api-kappa.vercel.app/",
    headers: {
        'Content-Type': 'application/json',
    }
});

export default api;
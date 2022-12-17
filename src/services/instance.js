import axios from "axios";

const instance = axios.create({
    baseURL: "https://code-6-charges.herokuapp.com",
    /* baseURL: "https://localhost:3001", */
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

export default instance;

import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE + "/api/pqrs" || "http://localhost:8080/api/pqrs";

export async function getPqrs() {
    const response = await axios.get(BASE_URL);
    return response.data;
}

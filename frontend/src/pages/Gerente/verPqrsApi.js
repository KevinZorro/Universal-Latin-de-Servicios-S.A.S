import axios from "axios";

const BASE_URL = "http://localhost:8080/api/pqrs";

export async function getPqrs() {
    const response = await axios.get(BASE_URL);
    return response.data;
}

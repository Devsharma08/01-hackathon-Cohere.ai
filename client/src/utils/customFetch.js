import axios from 'axios'
const customFetch = axios.create({
    baseURL: '/api/v1',
    withCredentials: true,
    headers: {
        "Cache-Control": "no-store",
        Pragma: "no-cache",
      }, // Enable credentials for all requests
})
export default customFetch
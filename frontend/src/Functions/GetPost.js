import Cookies from "js-cookie";

// Import environment variables
const SERVER = import.meta.env.VITE_SERVER;
const PORT = import.meta.env.VITE_PORT;
const ACCESS_TOKEN = import.meta.env.VITE_ACCESS_TOKEN;


export default async function GetPosts(username) {
    const access_token = Cookies.get(ACCESS_TOKEN);
    const r = await fetch(`${BASE_URL}/blogs/getuserposts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${access_token}`
        },
        body: JSON.stringify({username: username})
    });

    let resp = await r.json();

    return resp;
}
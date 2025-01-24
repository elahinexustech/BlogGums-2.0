import Cookies from "js-cookie";

// Import environment variables
import {
    SERVER,
    PORT,
    ACCESS_TOKEN,
} from '../_CONSTS_.js';

const BASE_URL = (SERVER && PORT) ? `${SERVER}:${PORT}` : '/choreo-apis/bloggums/backend/v1';


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
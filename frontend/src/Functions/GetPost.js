// Functions/GetPosts.js
import { SERVER, PORT, ACCESS_TOKEN, USER_DATA } from "../_CONSTS_";


export default async function GetPosts(username) {
    const access_token = localStorage.getItem(ACCESS_TOKEN);
    const r = await fetch(`${SERVER}:${PORT}/blogs/getuserposts`, {
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
import { ACCESS_TOKEN, PORT, SERVER } from "../_CONSTS_";

import Cookies from 'js-cookie'

export default async function postComment(data) {
    const access_token = Cookies.get(ACCESS_TOKEN);
    const r = await fetch(`${SERVER}:${PORT}/blogs/post_comment`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${access_token}`
        },
        body: JSON.stringify(data)
    });

    return await r.json();
}
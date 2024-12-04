import { ACCESS_TOKEN, PORT, SERVER } from "../_CONSTS_";

export default async function postComment(data) {
    const access_token = localStorage.getItem(ACCESS_TOKEN);
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
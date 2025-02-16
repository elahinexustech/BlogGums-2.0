import Cookies from 'js-cookie'

// Import environment variables
import {
    BASE_URL,
    ACCESS_TOKEN,
} from '../_CONSTS_.js';


export default async function postComment(data) {
    const access_token = Cookies.get(ACCESS_TOKEN);
    const r = await fetch(`${BASE_URL}/blogs/post_comment`, {
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
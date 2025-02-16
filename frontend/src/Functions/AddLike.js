import Cookies from 'js-cookie';

// Import environment variables
import {
    BASE_URL,
    ACCESS_TOKEN,
} from '../_CONSTS_';


export const AddLike = async (id) => {

    let access_token = Cookies.get(ACCESS_TOKEN);
    let r = await fetch(`${BASE_URL}/blogs/addlike`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${access_token}`
        },
        body: JSON.stringify({post_id: id})
    })

    let resp = await r.json();

    if(resp.status == 200) {
        return resp.like_count
    } else {
        AddLike(id);
    }

}   
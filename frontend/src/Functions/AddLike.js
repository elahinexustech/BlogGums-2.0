import { SERVER, PORT, ACCESS_TOKEN, REFRESH_TOKEN } from "../_CONSTS_"
import Cookies from 'js-cookie';


export const AddLike = async (id) => {

    console.log(id);

    let access_token = Cookies.get(ACCESS_TOKEN);
    let r = await fetch(`${SERVER}:${PORT}/blogs/addlike`, {
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
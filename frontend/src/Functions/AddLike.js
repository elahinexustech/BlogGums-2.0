import { SERVER, PORT, ACCESS_TOKEN, REFRESH_TOKEN } from "../_CONSTS_"


export const AddLike = async (id) => {

    console.log(id);

    let access_token = localStorage.getItem(ACCESS_TOKEN);
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
import Cookies from 'js-cookie';

// Import environment variables
const SERVER = import.meta.env.VITE_SERVER;
const PORT = import.meta.env.VITE_PORT;
const ACCESS_TOKEN = import.meta.env.VITE_ACCESS_TOKEN;

const BASE_URL = (SERVER && PORT) ? `${SERVER}:${PORT}` : '/choreo-apis/bloggums/backend/v1';


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
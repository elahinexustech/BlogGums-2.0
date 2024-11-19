// Functions/GetUser.js
import { SERVER, PORT, ACCESS_TOKEN, USER_DATA } from "../_CONSTS_";

export const USER = async (username='') => {
    const access_token = localStorage.getItem(ACCESS_TOKEN);

    try {
        if (!username) {
            const res = await fetch(`${SERVER}:${PORT}/api/user/check-auth/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${access_token}`
                },
            });

            if (res.status === 200) {
                const data = await res.json();
                localStorage.setItem(USER_DATA, JSON.stringify(data));
                return data;
            }
        } else {
            const res = await fetch(`${SERVER}:${PORT}/api/get/?username=${username}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${access_token}`
                },
            });

            if (res.status === 200) {
                const data = await res.json();
                return data;
            }
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        return null; // Return null or handle error as appropriate
    }
};

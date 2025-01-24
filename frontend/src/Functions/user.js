import Cookies from 'js-cookie'; // Import js-cookie

// Import environment variables
const SERVER = import.meta.env.VITE_SERVER;
const PORT = import.meta.env.VITE_PORT;
const ACCESS_TOKEN = import.meta.env.VITE_ACCESS_TOKEN;
const USER_DATA = import.meta.env.VITE_USER_DATA;

export const USER = async (username = '') => {
    const access_token = Cookies.get(ACCESS_TOKEN); // Get the token from cookies

    try {
        if (!username) {
            const res = await fetch(`${BASE_URL}/api/user/check-auth/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${access_token}`
                },
            });

            if (res.status === 200) {
                const data = await res.json();
                // Store user data in cookies instead of localStorage
                Cookies.set(USER_DATA, JSON.stringify(data), { expires: 7 }); // Set expiration as needed
                return data;
            }
        } else {
            const res = await fetch(`${BASE_URL}/api/get/?username=${username}`, {
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

export const updateUser = async (data) => {
    const access_token = Cookies.get(ACCESS_TOKEN); // Get the token from cookies

    const res = await fetch(`${BASE_URL}/api/user/update`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${access_token}`
        },
        body: JSON.stringify(data)
    });

    return await res.json();
};

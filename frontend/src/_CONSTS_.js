// const SERVER = 'http://127.0.0.1'
// const PORT = 8000

const SERVER = null
const PORT = null

export const ACCESS_TOKEN = "ACCESS_TOKEN"
export const REFRESH_TOKEN = "REFRESH_TOKEN"
export const THEME_MODE = "theme"
export const USER_DATA = 'User Data'
export const BLOG_FONT_SIZE = 'fs'
export const CODE_THEME = 'code theme'

export const BASE_URL = (SERVER && PORT) ? `${SERVER}:${PORT}` : '/choreo-apis/bloggums/backend/v1';
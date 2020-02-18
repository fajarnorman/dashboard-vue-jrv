import axios from 'axios'

export default() => {
    return axios.create({
        baseURL: process.env.BASE_URL + process.env.VERSION_LINK + process.env.CMSAPI_URL,
    })
}
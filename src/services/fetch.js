import Axios from 'axios'

const baseApiUrl = process.env.REACT_APP_BASE_API_URI
const reservationEndpoint = process.env.REACT_APP_POST_BOOKING_ENDPOINT



export const post = async (data) => {
    const postRes = await Axios.post(`${baseApiUrl}+${reservationEndpoint}`, data)
    return postRes
}

export const getReservations = async (date, token) => {
    const reservationRes = await Axios.get(`http://localhost:5000/admin/${date}`, { headers: { 'x-auth-token': token } })
    return reservationRes
}

export const getUserFromToken = async (token) => {
    const UserRes = await Axios.get('http://localhost:5000/admin/', { headers: { 'x-auth-token': token } })
    console.log("user resp is", UserRes.data)
    return UserRes
}
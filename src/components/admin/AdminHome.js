import './admin.scss'
import React, { useState, useContext, useEffect } from 'react'
import { UserContext } from '../../contexts/UserContext'
import Calendar from 'react-calendar'
import { config } from '../../config';
import moment from 'moment'
import Axios from 'axios'

//import icons
import { FaRegTrashAlt, FaPencilAlt } from "react-icons/fa";


const AdminHome = () => {

    const { userData, setUserData } = useContext(UserContext)
    const [deleted, setDeleted] = useState(false)
    const [date, setDate] = useState(new Date())
    const [reservations, setReservations] = useState([])
    const [todaysDate, setTodaysDate] = useState(moment(new Date()).format('YYYY-MM-DD'))
    const [noBookings, setNoBookings] = useState()


    let maxDate = new Date()
    maxDate.setMonth(maxDate.getMonth() + config.maxMonths)

    useEffect(() => {
        const getReservations = async () => {
            const reservationRes = await Axios.get(`http://localhost:5000/admin/${todaysDate}`)
            setReservations(reservationRes.data.data.reservation)
        }
        getReservations()
    }, [])


    useEffect(() => {
        const getNewReservations = async () => {
            const reservationRes = await Axios.get(`http://localhost:5000/admin/${todaysDate}`)
            setReservations(reservationRes.data.data.reservation)
        }
        getNewReservations()
    }, [todaysDate])

    const handleDelete = async id => {

        let res = await Axios.delete(`http://localhost:5000/admin/reservation/${id}`)
        console.log(res)
        if (res.status === 200) {
            const formattedDate = moment(date).format('YYYY-MM-DD')
            const getReservations = async () => {
                const reservationRes = await Axios.get(`http://localhost:5000/admin/${formattedDate}`)
                setReservations(reservationRes.data.data.reservation)
            }
            getReservations()
            console.log(reservations)
        }
        else { return null }
    }

    const handleChangeDate = date => {
        setDate(date)
        const formattedDate = moment(date).format('YYYY-MM-DD')
        const getReservations = async () => {
            const reservationRes = await Axios.get(`http://localhost:5000/admin/${formattedDate}`)
            setReservations(reservationRes.data.data.reservation)
            console.log(reservationRes.data.data.reservation)
            if (reservationRes.data.data.reservation.length < 1) {
                setNoBookings(true)
            }
            else {
                setNoBookings(false)
            }
        }
        getReservations()
    }



    return (
        <>
            <div className="admin-wrapper">
                <div className="head">
                    <h1> Login as, {userData.user.email}</h1>
                    <p>{todaysDate}</p>
                </div>
                <div className="cont">
                    <div className="outer">
                        {!noBookings ?
                            reservations.map((booking, index) => (
                                <div key={index} className="inner">
                                    <div className="item-box">
                                        <p><strong>{booking.firstname} {booking.lastname}</strong> {moment(booking.date).format('DD/MM')} <strong>{booking.time}</strong> {booking.people} persons  <a className="btn"><FaPencilAlt /></a><a onClick={() => handleDelete(booking._id)}><FaRegTrashAlt/></a></p>
                                    </div>
                                </div>
                            

                            )) : <p className="no-books">Sorry no bookins on this date</p>}
                    </div>
                    <div className="date-outer">
                        <Calendar
                            onChange={handleChangeDate}
                            value={date}
                            maxDate={maxDate}
                            minDate={new Date()}

                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdminHome

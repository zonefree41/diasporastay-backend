import { useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { HOTELS } from '../data/hotels'
import axios from 'axios'

const API = import.meta.env.VITE_API_BASE;


function useQuery() {
    const { search } = useLocation()
    return useMemo(() => new URLSearchParams(search), [search])
}

export default function Checkout() {
    const q = useQuery()
    const hotelId = q.get('hotel')
    const hotel = HOTELS.find(h => h.id === hotelId) || HOTELS[0]

    const [nights, setNights] = useState(2)
    const [guests, setGuests] = useState(2)
    const total = (hotel.price * nights).toFixed(2)

    const handleCheckout = async () => {
        try {
            const res = await axios.post('http://localhost:5000/api/create-checkout-session', {
                hotel, nights, guests
            })
            window.location.href = res.data.url
        } catch (err) {
            alert("Payment failed: " + err.message)
        }
    }

    return (
        <div className="container py-4">
            {/* ...Traveler form + summary UI... */}
            <button className="btn btn-primary mt-3" onClick={handleCheckout}>
                Confirm & Pay ${total}
            </button>
        </div>
    )
}

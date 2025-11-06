import { Routes, Route } from 'react-router-dom'
import DSNavbar from './components/DSNavbar'
import DSFooter from './components/DSFooter'
import Home from './pages/Home'
import Explore from './pages/Explore'
import Hotel from './pages/Hotel'
import Checkout from './pages/Checkout'
import MyBookings from './pages/MyBookings'
import Success from './pages/Success.jsx';


import Success from './pages/Success'
import Cancel from './pages/Cancel'



export default function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <DSNavbar />
      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/hotel/:id" element={<Hotel />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/success" element={<Success />} />
          <Route path="/cancel" element={<Cancel />} />
          <Route path="/my-bookings" element={<MyBookings />} />
        </Routes>
      </main>
      <DSFooter />
    </div>
  )
}
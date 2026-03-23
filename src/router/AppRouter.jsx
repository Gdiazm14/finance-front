import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Pages (las crearemos después)
import Login from '../pages/Login/Login'
import Register from '../pages/Register/Register'
import Dashboard from '../pages/Dashboard/Dashboard'
import Accounts from '../pages/Accounts/Accounts'
import Transactions from '../pages/Transactions/Transactions'
import Profile from '../pages/Profile/Profile'
import Categories from '../pages/Categories/Categories'
import Support from '../pages/Support/Support'
import About from '../pages/About/About'


function PrivateRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

function PublicRoute({ children }) {
  const { user } = useAuth()
  return !user ? children : <Navigate to="/dashboard" replace />
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route path="/login" element={
          <PublicRoute><Login /></PublicRoute>
        } />


        <Route path="/register" element={
          <PublicRoute><Register /></PublicRoute>
        } />

        <Route path="/profile" element={
          <PrivateRoute><Profile /></PrivateRoute>
        } />

        <Route path="/categories" element={
          <PrivateRoute><Categories /></PrivateRoute>
        } />
        <Route path="/dashboard" element={
          <PrivateRoute><Dashboard /></PrivateRoute>
        } />

        <Route path="/accounts" element={
          <PrivateRoute><Accounts /></PrivateRoute>
        } />

        <Route path="/transactions" element={
          <PrivateRoute><Transactions /></PrivateRoute>
        } />
        <Route path="/support" element={
          <PrivateRoute><Support /></PrivateRoute>
        } />

        <Route path="/about" element={
          <PrivateRoute><About /></PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}
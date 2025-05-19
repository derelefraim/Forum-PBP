import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/login.tsx'
import Home from './pages/home.tsx'
import Register from './pages/register.tsx'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Register" element={<Register />} />
      </Routes>
    </Router>
  )
}

export default App

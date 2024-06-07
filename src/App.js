import './App.css';
import {BrowserRouter as Router,Route, Routes } from 'react-router-dom';
import Login from './components/Login'
import Register from './components/Register';
import Profile from './components/Profile';
import AdminPanel from './components/AdminPanel';

function App() {
  return (
    <Router>
      <div className='App'>
      <Routes>
         <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/" element={<Login />} />
          <Route path="/Admin" element={<AdminPanel/>}></Route>
      </Routes>
      </div>
    </Router>
  );
}

export default App;

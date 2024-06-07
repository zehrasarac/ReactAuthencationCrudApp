import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Button, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () =>{
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error,setError] = useState('');
    const navigate = useNavigate();

    const handleLogin= async(e) =>{
        e.preventDefault();
        setError('');
        try {
            const response = await axios.post('http://localhost:5173/api/Employees/Login',{email,password});
            if (response.status===200) {
                const {user} = response.data;
                localStorage.setItem('user',JSON.stringify(user));
                if (user.isAdmin) {
                    navigate('/admin');
                }
                else{
                navigate('/profile');
                }
            }
        } catch (error) {
            if (error.response && error.response.data) {
                setError(error.response.data);
            }
            else {
                setError("Bir hata oluştu.")
            }
        }
    };

    return (
        <div className='form-container'>
            <h2>Login</h2>
            {error && <Alert variant='danger'>{error}</Alert>}
            <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3" controlId="formBasicEmail"> 
                <Form.Label>Email</Form.Label>
                <Form.Control 
                type='email'
                placeholder='Mail Adresi'
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                required
                />
                </Form.Group>
                <Form.Group className='mb-3' controlId='formPassword'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                    type='password'
                    placeholder='Sifre'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    />
                </Form.Group>
                <Button variant='primary' type='submit'>Giriş</Button>
                <Form.Group className='mb-3' controlId='formRegister'>
                    <Link to="/register"><label>Henüz Kayıt olmadın mı?</label></Link> 
                </Form.Group>
            </Form>
        </div>
    )
}

export default Login;
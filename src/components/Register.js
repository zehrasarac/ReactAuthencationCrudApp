import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Button, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


const Register = () =>{
    const [name,setName] = useState('');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [error,setError] = useState('');
    const navigate = useNavigate();


    const handleRegister= async(e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await axios.post('http://localhost:5173/api/Employees/Register', {name,email,password});
            if (response.status ===200) {
                navigate('/login');
            }
        } catch (error) {
            if (error.response && error.response.data) {
                setError(error.response.data);
            }
            else{
                setError("Bir hata oluştu.")
            }
        }
    };


    return (
        <div className='form-container'>
            <h2>Kayıt Ol</h2>
            {error && <Alert variant='danger'>{error}</Alert>}
            <Form onSubmit={handleRegister}>
                <Form.Group className="mb-3" controlId="formBasicName">
                    <Form.Label>Name</Form.Label>   
                    <Form.Control 
                        type = "text"
                        placeholder = "İsim"
                        value = {name}
                        onChange = {(e) => setName(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type= "email"
                        placeholder = "EMail"
                        value = {email} 
                        onChange={(e)=> setEmail(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formbasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                        type = "password"
                        placeholder = "Sifre"
                        value = {password}
                        onChange = {(e)=> setPassword(e.target.value)}
                        required
                    />
                </Form.Group>
                <Button variant="primary" type="submit">Kayıt</Button> &nbsp;
                <Form.Label><Link to={"/login"}>Anasayfa Dön</Link></Form.Label>
            </Form>
        </div>


    )


}

export default Register;
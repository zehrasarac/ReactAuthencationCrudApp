import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {Alert, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Table from 'react-bootstrap/Table';


const Profile = () =>{
    const [user,setUser] = useState(null);
    const [loading,setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(()=>{
        const userProfile = async () =>{
            try {
                const registeredUser = localStorage.getItem('user');
                if (!registeredUser) {
                    navigate('/login');
                    return;
                }

                const newUser = JSON.parse(registeredUser);
                if (!newUser.id) {
                    setError('user ıd doğru değil');
                    setLoading(false);
                    return;
                }

                console.log('Kayıtlı Kullanıcı', newUser);

                const response = await axios.get(`http://localhost:5173/api/Employees/${newUser.id}`);
                setUser(response.data);
                setLoading(false);

            } catch (error) {
                console.error('Kullanıcı pro hata',error);
                setError('Kullancı pro hata')
                setLoading(false);
            }
        };

        userProfile();
    },[navigate]);

    const logout = () =>{
        localStorage.removeItem('user');
        navigate('/login');
    }

    if (loading) return <div>loading...</div>;

    if (!user) return <Alert variant='danger'>Hata</Alert>;


    return (
        <Table striped bordered hover>
      <thead>
        <tr>
          <th colSpan={4}><h2>Çalışan Profili</h2></th>
        </tr>
        <tr>
          <th>İsim</th>
          <th>Email</th>
          <th>Admin Mi:</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{user.name}</td>
          <td>{user.email}</td>
          <td>{user.isAdmin ? 'Evet' : 'Hayır'}</td>
        </tr>
        <Button variant="danger" onClick={logout}>Çıkış</Button>
      </tbody>
    </Table>
    );

};

export default Profile;
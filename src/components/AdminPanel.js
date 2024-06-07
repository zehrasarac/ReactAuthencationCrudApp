import React, { useState, useEffect, Fragment } from "react";
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Navigate, useNavigate } from "react-router-dom";

function AdminPanel() {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isActive, setIsActive] = useState(0);

    const [editId, setEditId] = useState("");
    const [editName, setEditName] = useState("");
    const [editEmail, setEditEmail] = useState("");
    const [editPassword, setEditPassword] = useState("");
    const [editIsActive, setEditIsActive] = useState(0);

    const [data, setData] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        getData();
    }, []);

    const getData = () => {
        axios.get('http://localhost:5173/api/Employees/GetAllUsers')
            .then((result) => {
                setData(result.data);
            })
            .catch((error) => {
                console.log("Bir hata oluştu", error);
            });
    };

    const handleEdit = (id) => {
        console.log("Edit button", id);
        handleShow();
        axios.get(`http://localhost:5173/api/Employees/${id}`)
            .then((result) => {
                setEditName(result.data.name);
                setEditEmail(result.data.email);
                setEditPassword(result.data.password);
                setEditIsActive(result.data.isActive);
                setEditId(result.data.id);  
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleDelete = (id) => {
        if (window.confirm("Silmek istediğine emin misin?") === true) {
            axios.delete(`http://localhost:5173/api/Employees/${id}`)
                .then((result) => {
                    if (result.status === 200) {
                        toast.success("Çalışan bilgisi silindi");
                        getData();
                    }
                })
                .catch((error) => {
                    toast.error(error.message);
                });
        }
    };
    const handleUpdate = () => {
        if (!editId) {
            toast.error("Geçersiz ID");
            return;
        }
        const url = `http://localhost:5173/api/Employees`;
        const data = {
            "id": editId,
            "name": editName,
            "email": editEmail,
            "password": editPassword,
            "isActive": editIsActive
        };
        axios.put(url, data)
            .then((result) => {
                handleClose();
                getData();
                clear();
                toast.success("Çalışan Bilgisi Güncellendi");
            }).catch((error) => {
                toast.error(error.message);
            });
    };
    

    const handleSave = () => {
        const url = 'http://localhost:5173/api/Employees/Register';
        const data = {
            "name": name,
            "email": email,
            "password": password,
            "isActive": isActive
        };
        axios.post(url, data)
            .then((result) => {
                getData();
                clear();
                toast.success("Çalışan Bilgisi Eklendi");
            }).catch((error) => {
                toast.error(error.message);
            });
    };

    const handleActiveChange = (e) => {
        if(e.target.checked){
            setIsActive(true);
        }
        else{
            setIsActive(false);
        }
    };

    const handleEditActiveChange = (e) => {
        if(e.target.checked){
            setEditIsActive(true);
        }
        else{
            setEditIsActive(false);
        }
    };

    const clear = () => {
        setName('');
        setEmail('');
        setPassword('');
        setIsActive(false);
        setEditName('');
        setEditEmail('');
        setEditPassword('');
        setEditIsActive(false);
        setEditId(null);
    };

    const logout = () =>{
        localStorage.removeItem('user');
        navigate('/login');
    }

    return (
        <Fragment>
            <ToastContainer />
            <Container>
                <Row>
                    <Col>
                        <input type="text" className="form-control" placeholder="İsim" value={name} onChange={(e) => setName(e.target.value)} />
                    </Col>
                    <Col>
                        <input type="text" className="form-control" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </Col>
                    <Col>
                        <input type="password" className="form-control" placeholder="Şifre" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </Col>
                    <Col>
                        <input type="checkbox" checked={isActive == 1 ? true : false} onChange={handleActiveChange} value={isActive} />
                        <label>IsActive</label>
                    </Col>
                    <Col>
                        <button className="btn btn-primary" onClick={handleSave}>Kaydet</button>
                    </Col>
                </Row>
            </Container>
            <br />
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Password</th>
                        <th>IsActive</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data && data.length > 0 ?
                        data.map((item, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.name}</td>
                                <td>{item.email}</td>
                                <td>{item.password}</td>
                                <td>{item.isActive ? "1" : "0"}</td>
                                <td>
                                    <button className="btn btn-primary" onClick={() => handleEdit(item.id)}>Düzenle</button> &nbsp;
                                    <button className="btn btn-danger" onClick={() => handleDelete(item.id)}>Sil</button>
                                </td>
                            </tr>
                        ))
                        :
                        <tr><td colSpan="6">Loading...</td></tr>
                    }
                </tbody>
            </Table>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Kişi Düzenle</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col>
                            <input type="text" className="form-control" placeholder="İsim" value={editName} onChange={(e) => setEditName(e.target.value)} />
                        </Col>
                        <Col>
                            <input type="email" className="form-control" placeholder="Email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} />
                        </Col>
                        <Col>
                            <input type="password" className="form-control" placeholder="Şifre" value={editPassword} onChange={(e) => setEditPassword(e.target.value)} />
                        </Col>
                        <Col>
                            <input type="checkbox" checked={editIsActive == 1 ? true : false} onChange={(e)=>handleEditActiveChange(e)} value={editIsActive} />
                            <label>IsActive</label>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Kapat
                    </Button>
                    <Button variant="primary" onClick={handleUpdate}>
                        Kaydet
                    </Button>
                </Modal.Footer>
            </Modal>
            <Button variant="danger" onClick={logout}>Çıkış</Button>
        </Fragment>
        
    );
}

export default AdminPanel;

import "../../css/style.css";
import Navbar from "../../components/navbar/navbar";
import { Link, useNavigate } from "react-router-dom";
import Appointment from "../../components/navbar/appointment/appointment.jsx";
import { useEffect, useState } from "react";
import api from "../../constants/api.js";
import {confirmAlert} from "react-confirm-alert";
import 'react-confirm-alert/src/react-confirm-alert.css';

function Appointments() {

    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]); 
    const [idDoctor, setIdDoctor] = useState("");

    const [dtStart, setDtStart] = useState("");
    const [dtEnd, setDtEnd] = useState("");

    function ClickEdit (id_appointment) {
        navigate("/appointments/edit/" + id_appointment);
    }

    function ClickDelete (id_appointment) {
        confirmAlert({
            title: "Exclusão",
            message: "Você deseja excluir este agendamento?",
            buttons: [
                {
                    label: "Sim",
                    onClick: () => DeleteAppointment(id_appointment)
                },
                {
                    label: "Não",
                    onClick: () => { }
                }
            ]
        });
    }

    async function DeleteAppointment(id) {

        try {
            const response = await api.delete("/appointments/" + id);

        if (response.data) {
            LoadAppointments();
        }
        } catch (error) {
            if (error.response?.data.error) {
                if (error.response.status == 401) 
                    return navigate("/");
                
                alert(error.response?.data.error);            
            
        } else {
            alert("Erro ao excluir dados. " + error.message);
            }
        }
    }

    async function LoadDoctors() {

        try {
            const response = await api.get("/doctors");

        if (response.data) {
            setDoctors(response.data);
        }
        } catch (error) {
            if (error.response?.data.error) {
                if (error.response.status == 401) 
                    return navigate("/");
                
                alert(error.response?.data.error);            
            
        } else {
            alert("Erro ao listar médico. " + error.message);
            }
        }
    }

    async function LoadAppointments() {

        try {
            const response = await api.get("/admin/appointments", {
                params: {
                    id_doctor: idDoctor,
                    dt_start: dtStart,
                    dt_end: dtEnd
                }
            });

        if (response.data) {
            setAppointments(response.data);
            }

        } catch (error) {
            if (error.response?.data.error) {
                if (error.response.status == 401) 
                    return navigate("/");
                
                alert(error.response?.data.error);            
            }             
            else 
                alert("Erro ao efetuar login. " + error.message);  
        }
    }

    function ChangeDoctor(e) {
        setIdDoctor(e.target.value);
    }

    useEffect(() => {
        LoadDoctors();
        LoadAppointments();
    }, []);

    return (
        <div className="container-fluid mt-page">
            <Navbar />

            <div className="d-flex justify-content-between align-items-center">
                <div>
                    <h2 className="d-inline">Tela Appointments</h2>
                    <Link to="/appointments/add" className="btn btn-outline-primary ms-5 mb-2">
                        Novo Agendamento
                    </Link>
                </div>

                <div>
                    <input id="startDate" type="date" className="form-control" onChange={(e) => setDtStart(e.target.value)} />
                    <span className="m-2">Até</span>
                    <input id="endtDate" type="date" className="form-control" onChange={(e) => setDtEnd(e.target.value)} />

                    <div className="form-control ms-3 me-3">
                        <select className="doctor" id="doctor" value={idDoctor}
                        onChange={ChangeDoctor}>
                            <option value="">Todos os médicos</option>

                            {
                                doctors.map((doc) => {
                                    return (
                                    <option key={doc.id_doctor} value={doc.id_doctor}>
                                            {doc.name}
                                    </option>
                                )})
                            }

                        </select>
                    </div>

                    <button onClick={LoadAppointments} className="btn btn-primary" type="button">Filtrar</button>

                </div>

            </div>

            <div>
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">Paciente</th>
                            <th scope="col">Médico</th>
                            <th scope="col">Serviço</th>
                            <th scope="col">Data/Hora</th>
                            <th scope="col" className="text-end">Valor</th>
                            <th scope="col" className="col-buttons"></th>
                        </tr>
                    </thead>
                    <tbody>
                            {
                                appointments.map((ap) => {
                                    return <Appointment key={ap.id_appointment}
                                    id_appointment={ap.id_appointment}
                                    user={ap.user}
                                    doctor={ap.doctor}
                                    service={ap.service}
                                    booking_date={ap.booking_date}
                                    booking_hour={ap.booking_hour}
                                    price={ap.price}
                                    ClickEdit={ClickEdit}
                                    ClickDelete={ClickDelete}
                                    />
                                })
                            }
                    </tbody>
                </table>
            </div>
        </div>
      
       
    )
}

export default Appointments;
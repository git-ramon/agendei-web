import { Link, useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/navbar";
import { useEffect, useState } from "react";
import api from "../../constants/api.js";

function AppointmentAdd () {

    const navigate = useNavigate();
    const {id_appointment} = useParams();
    const [users, setUsers] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [services, setServices] = useState([]);

    const [idUser, setidUser] = useState("");
    const [idDoctor, setidDoctor] = useState("");
    const [idService, setidService] = useState("");
    const [bookingDate, setbookingDate] = useState("");
    const [bookingHour, setbookingHour] = useState("");

    async function LoadDoctors() {

        try {
            const response = await api.get("/doctors");

        if (response.data) {
            setDoctors(response.data);

            //Mode de alteração:
            if (id_appointment > 0) {
                LoadAppointment(id_appointment)
            }
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

    async function LoadAppointment (id) {

        if (!id) {
            return;
        }

        try {
            const response = await api.get("/admin/appointments/" + id);

        if (response.data) {
            setidUser(response.data.id_user);
            setidDoctor(response.data.id_doctor);
            setidService(response.data.id_service);
            setbookingDate(response.data.booking_date);
            setbookingHour(response.data.booking_hour);
            }

        } catch (error) {
            if (error.response?.data.error) {
                if (error.response.status == 401) 
                    return navigate("/");
                
                alert(error.response?.data.error);            
            
        } else {
            alert("Erro ao listar Serviços. " + error.message);
            }
        }
    }

    async function LoadUsers (){

        try {
            const response = await api.get("/admin/users");

        if (response.data) {
            setUsers(response.data);
        }
        } catch (error) {
            if (error.response?.data.error) {
                if (error.response.status == 401) 
                    return navigate("/");
                
                alert(error.response?.data.error);            
            
        } else {
            alert("Erro ao listar pacientes. " + error.message);
            }
        }
    }

    async function LoadServices (id) {

        if (!id) {
            return;
        }

        try {
            const response = await api.get("/doctors/" + id + "/services");

        if (response.data) {
            setServices(response.data);
            }
        } catch (error) {
            if (error.response?.data.error) {
                if (error.response.status == 401) 
                    return navigate("/");
                
                alert(error.response?.data.error);            
            
        } else {
            alert("Erro ao listar Serviços. " + error.message);
            }
        }
    }

    async function SaveAppointment() {

        const json = {
            id_user: idUser,
            id_doctor: idDoctor,
            id_service: idService,
            booking_date: bookingDate,
            booking_hour: bookingHour
        }

        try {
            const response = id_appointment > 0 ?
                await api.put("/admin/appointments/" + id_appointment, json)
            :
                await api.post("/admin/appointments", json);

            if (response.data) {
                navigate("/appointments");
            } 

        } catch (error) {
            if (error.response?.data.error) {
                if (error.response.data == 401) {
                    navigate("/");
    
                    alert(error.response?.data.error)
                } else {
                    alert("Erro ao salvar dados!");
                }
            }        
        }
    }

    useEffect(() => {
        LoadUsers();
        LoadDoctors();
    }, []);

    useEffect(() => {
        LoadServices(idDoctor)
    }, [idDoctor]);

    return (
        <>
            <Navbar />

            <div className="container-fluid mt-page">
                <div className="row col-lg-4 offset-lg-4">
                    <div className="col-12 mt-2">
                        <h2>
                            {
                                id_appointment > 0 ? "Editar Agendamento" : "Novo Agendamento"
                            }
                        </h2>
                    </div>

                    <div className="col-12 mt-4">
                        <label htmlFor="user" className="form-label">Paciente</label>
                        <div className="form-control mb-2">
                            <select className="user" id="user"
                            value={idUser} onChange={(e) => setidUser(e.target.value)}>                            
                                <option value="0">Selecione o Paciente</option>

                                {
                                    users.map((u) => {
                                        return (
                                        <option key={u.id_user} value={u.id_user}>
                                                {u.name}
                                        </option>
                                    )})
                                }

                            </select>
                        </div>
                    </div>

                    <div className="col-12 mt-4">
                        <label htmlFor="doctor" className="form-label">Médico</label>
                        <div className="form-control mb-2">
                            <select className="doctor" id="doctor"
                            value={idDoctor} onChange={(e) => setidDoctor(e.target.value)}>
                                <option value="">Selecione os médico</option>

                                {
                                    doctors.map((d) => {
                                        return (
                                        <option key={d.id_doctor} value={d.id_doctor}>
                                                {d.name}
                                        </option>
                                    )})
                                }

                            </select>
                        </div>
                    </div>

                    <div className="col-12 mt-3">
                        <label htmlFor="service" className="form-label">Serviço</label>
                        <div className="form-control mb-2">
                            <select className="service" id="service"
                            value={idService} onChange={(e) => setidService(e.target.value)}>
                                <option value="0">Selecione o serviço</option>

                                {
                                    services.map((s) => {
                                        return (
                                        <option key={s.id_service} value={s.id_service}>
                                                {s.description}
                                        </option>
                                    )})
                                }

                            </select>
                        </div>
                    </div>

                    <div className="col-6 mt-3">
                        <label htmlFor="bookingDate" className="form-label">Data</label>
                        <input type="date" className="form-control" name="bookingDate" id="bookingDate"
                        value={bookingDate} onChange={(e) => setbookingDate(e.target.value)}/>
                    </div>

                    <div className="col-6 mt-3">
                        <label htmlFor="boodingHour" className="form-label">Horário</label>
                        <div className="form-control mb-2">
                            <select name="boodingHour" id="boodingHour"
                            value={bookingHour} onChange={(e) => setbookingHour(e.target.value)}>
                                <option value="0">Horário</option>
                                <option value="08:00">08:00</option>
                                <option value="09:00">09:00</option>
                                <option value="10:00">10:00</option>
                                <option value="11:00">11:00</option>
                                <option value="12:00">12:00</option>
                                <option value="13:00">13:00</option>
                                <option value="14:00">14:00</option>
                                <option value="15:00">15:00</option>
                                <option value="16:00">16:00</option>
                                <option value="17:00">17:00</option>
                                <option value="18:00">18:00</option>
                            </select>
                        </div>
                    </div>

                    <div className="col-12 mt-3">
                        <div className="d-flex justify-content-end">
                            <Link to="/appointments" className="btn btn-outline-primary me-3">
                                Cancelar
                            </Link>
                            <button onClick={SaveAppointment} className="btn btn-primary" type="button">Salvar Dados</button>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}

export default AppointmentAdd;
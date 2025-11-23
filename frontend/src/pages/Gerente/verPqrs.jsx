import React, { useEffect, useState } from "react";
import { getPqrs } from "./verPqrsApi";
import "./verPqrs.css";

export default function VerPqrs() {
    const [pqrs, setPqrs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPqrs();
    }, []);

    const loadPqrs = async () => {
        try {
            const data = await getPqrs();
            setPqrs(data);
        } catch (error) {
            console.error("Error cargando PQRS:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p className="loading">Cargando PQRS...</p>;

    return (
        <div className="pqrs-container">
            <h2 className="pqrs-title">Listado de PQRS</h2>

            {pqrs.length === 0 ? (
                <p className="no-data">No hay PQRS registradas.</p>
            ) : (
                <div className="pqrs-list">
                    {pqrs.map((item) => (
                        <div key={item.id} className="pqrs-card">
                            <div className="pqrs-header">
                                <span className="pqrs-type">{item.tipo}</span>
                                <span className={`pqrs-status ${item.estado.toLowerCase()}`}>
                                    {item.estado}
                                </span>
                            </div>

                            <p className="pqrs-desc">
                                {item.descripcion}
                            </p>

                            <div className="pqrs-info">
                                <p><strong>Fecha:</strong> {new Date(item.fechaCreacion).toLocaleString()}</p>
                                <p><strong>Cliente ID:</strong> {item.clienteId}</p>
                                <p><strong>Nombre:</strong> {item.nombreCompleto}</p>
                                <p><strong>Email:</strong> {item.email}</p>
                                <p><strong>Teléfono:</strong> {item.telefono}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

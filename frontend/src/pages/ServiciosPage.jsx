// src/pages/ServiciosPage.jsx
import React from "react";
import ServiciosManager from "../components/ServiciosManager";

export default function ServiciosPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-center">Gestión de Servicios</h1>
      <ServiciosManager />
    </div>
  );
}

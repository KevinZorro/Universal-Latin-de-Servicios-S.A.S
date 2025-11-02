import React from 'react';
import './NosotrosPage.css'; // Estilos para esta página

function NosotrosPage() {
  return (
    <div className="nosotros-container">
      {/* Contenido de la página "Quiénes Somos" */}
      <main className="info-empresa">
        
        {/* Sección principal */}
        <section className="info-seccion info-principal">
          <h2>Quiénes Somos</h2>
          <h3>UNIVERSAL LATIN DE SERVICIOS S.A.S.</h3>
          <p>
            Es una empresa en servicios de concerjeria, mantenimiento, jardineria, aseo, cafeteria, 
            recepcion, piscineros, oficios varios  y todo tipo de operarios en general incluyendo un 
            paquete integral  donde se complementa  el recurso humano con los insumos y maquinaria. 
            Ofrecemos bienestar, responsabilidad en la labor contratada. Buscamos generar confianza, 
            tranquilidad, bienestar, disminucion de cargas administrativas, riesgos patronales y reduccion 
            de gastos donde la empresa . Convirtiendonos en socios de valor de nuestrosclientes y aliados
            estrategicos en servicios con seguridad integral.
          </p>
          <p>
            Fue inscrita en camara de comercio de cucuta  el 22 de Enero del 2021 bajo el numero 09374401 
            del libro IX  con matricula mercantil No 3859905
          </p>
        </section>

        {/* Contenedor para Misión y Visión (lado a lado) */}
        <div className="mision-vision-container">
          {/* Misión (Texto del Portafolio) */}
          <section className="tarjeta-nosotros">
            <h3>Nuestra Misión</h3>
            <p>
              Prestación de servicios generales tales como conserjes, control de acceso de porterías, aseo y cafetería, 
              jardinería Piscineros, salva vidas y oficios varios entre otros, enmarcados en el concepto de seguridad y
              satisfacción. Mediante Una administración responsable, honesta, Con credibilidad que busca a través de personal 
              altamente calificado, confiable, e innovador, a satisfacer las expectativas de nuestros clientes convirtiéndonos 
              en socios de valor procurando convertirnos en su aliado estratégico en servicios con seguridad integral. 
            </p>
          </section>

          {/* Visión (Texto del Portafolio) */}
          <section className="tarjeta-nosotros">
            <h3>Nuestra Visión</h3>
            <p>
              Para el año 2031 ser una empresa reconocida, distinguida, renombrada y demandante, en el sector de los servicios 
              generales e integrales vinculados con usuarios satisfechos, debido a nuestra oportuna atención a sus necesidades, 
              nuestro propósito es proporcionar tranquilidad absoluta a nuestros clientes y, mediante esta alianza debemos Formar 
              recursos humanos que contribuyan al desarrollo tendiente a reforzar la confianza de nuestros futuros usuarios.
            </p>
          </section>
        </div>

        {/* Política de Calidad */}
        <section className="info-seccion">
          <h3>Política de Calidad</h3>
          <p>
            Nuestra política de calidad se manifiesta mediante nuestro firme compromiso 
            con los clientes de satisfacer plenamente sus requerimientos y expectativas, 
            para ello garantizamos impulsar una cultura de calidad basada en los principios 
            de responsabilidad, honestidad, confianza, liderazgo y desarrollo del recurso humano, 
            solidaridad, compromiso de mejora y seguridad en nuestras operaciones.
          </p>
        </section>

        {/* Nuestro Objetivo */}
        <section className="info-seccion">
          <h3>Nuestro Objetivo</h3>
          <p>
            Nuestro principal objetivo es restablecer la confianza y credibilidad de la prestación 
            de nuestros servicios, basado y demostrado en nuestro excelente servicio, garantizando 
            a nuestros  empleados un sueldo digno, seguridad social, prestaciones de ley, dotaciones, 
            descansos y todos los beneficios que la ley les confiere, de acuerdo a las nuevas reglamentaciones 
            y recomendaciones  expedidas por el ministerio de la protección social, logrando este objetivo estaremos 
            seguros de haber cumplido nuestro objetivo principal
          </p>
          <p>
            A si mismo restablecer la tranquilidad de cada uno de nuestros usuarios para que se sientan tranquilos
            y satisfechos de haber contratado una excelente empresa que se encargue de sus necesidades.
          </p>
        </section>

        {/* Selección de Personal */}
        <section className="info-seccion">
          <h3>Selección de Personal</h3>
          <p>
            Mediante una selección minuciosa de personal tanto operativo como administrativo, 
            verificando los diplomas y certificados expedidos por las academias de seguridad 
            autorizadas, nuestra selección consta de personal que cubran los mínimos requisitos como son:
          </p>
          <ul className="lista-requisitos">
            <li>Actividad física</li>
            <li>Entrevista personal y estudio de seguridad</li>
            <li>Verificación de antecedentes judiciales</li>
            <li>Situación militar definida</li>
            <li>Actitud y experiencia para el cargo</li>
            <li>Estudio de inducción </li>
            <li>Curso de capacitación como programas desarrollados y aprobados</li>
            <li>Dentro del curso de capacitación está incluido:</li>
            <ul className="sublista-requisitos">
              <li>Ética y profesionalismo</li>
              <li>Relaciones humanas y liderazgo</li>
              <li>Normatividad legal</li>
              <li>Relaciones con las autoridades</li>
              <li>Conocimiento, uso practica de evacuación</li>
              <li>Manejo de emergencias y seguridad industrial</li>
            </ul>
          </ul>
          <p>
            Todo aspirante o integrante de la empresa tanto masculino como femenino 
            es sometido a una rigurosa selección y verificación documental y la visita 
            domiciliaria para verificar su convivencia y su comportamiento con la sociedad.
          </p>
        </section>

        {/* Supervisión y Presentación */}
        <section className="info-seccion">
          <h3>Supervisión y Presentación</h3>
          <p>
            Las (24) horas estaremos verificando la efectividad en la prestación del servicio reportando
            cada hora a la central de radio monitoreo mediante la nueva tecnología en comunicaciones por 
            medio de Avantel , y las continuas  visitas físicas  en cada puesto de trabajo para que haya 
            pleno  cumplimiento en las consignas asignadas.
          </p>
          <p>
            En nuestra empresa los empleados cuentan con una eficiente presentación personal con el uniforme
            debidamente identificado con sus insignias y distintivos donde se puede observar con claridad el 
            nombre de la empresa y e apellidos del empleado quien está de servicio  donde le garantizamos las 
            dotaciones completas por el año con el objetivo de mantener a si la mejor imagen de las instalaciones 
            de nuestro cuidado.
          </p>
        </section>

        {/* Clientes */}
        <section className="info-seccion clientes-seccion">
          <h3>Algunos de Nuestros Clientes</h3>
          <ul className="clientes-lista">
            <li>Edificio mixto el Quinta P.H.</li>
            <li>Conjunto residencial apartamentos Tierra linda P.H.</li>
            <li>Conjunto residencial Paseo del rio.</li>
            <li>Edificio Lufam.</li>
            <li>Distribuciones Zazpi S.A.S.</li>
            <li>Constructora Villas de Rodeo S.A.S.</li>
            <li>Conjunto residencial San Sebastián.</li>
            <li>Edificio villa real PH</li>
            <li>Moto repuestos Wheiner sas</li>
          </ul>
        </section>

      </main>
    </div>
  );
}

export default NosotrosPage;


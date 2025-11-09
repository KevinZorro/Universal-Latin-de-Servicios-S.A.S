import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './HomePage';
import NosotrosPage from './NosotrosPage';
import ServiciosPage from './ServiciosPage';
import ContactoPage from './ContactoPage';
import PqrsForm from './components/PqrsForm';
import TrabajaForm from './components/TrabajaForm'; // Importamos el nuevo formulario

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  // Estado para el modal de PQRS
  const [isPqrsOpen, setIsPqrsOpen] = useState(false);
  const openPqrs = () => setIsPqrsOpen(true);
  const closePqrs = () => setIsPqrsOpen(false);

  // NUEVO: Estado para el modal de "Trabaja con Nosotros"
  const [isTrabajaOpen, setIsTrabajaOpen] = useState(false);
  const openTrabaja = () => setIsTrabajaOpen(true);
  const closeTrabaja = () => setIsTrabajaOpen(false);

  return (
    <div className="App">
      <Header />
      <ScrollToTop />
      
      <Routes>
        {/* Pasamos la función openTrabaja a HomePage */}
        <Route path="/" element={<HomePage onOpenTrabaja={openTrabaja} />} />
        <Route path="/nosotros" element={<NosotrosPage />} />
        <Route path="/servicios" element={<ServiciosPage />} />
        <Route path="/contacto" element={<ContactoPage onOpenPqrs={openPqrs} />} />
      </Routes>

      <Footer onOpenPqrs={openPqrs} />

      {/* Renderizado condicional de los modales */}
      {isPqrsOpen && <PqrsForm onClose={closePqrs} />}
      {isTrabajaOpen && <TrabajaForm onClose={closeTrabaja} />}
    </div>
  );
}

export default App;
import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react'; // Importar useEffect
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './HomePage';
import NosotrosPage from './NosotrosPage';
import ServiciosPage from './ServiciosPage';
import ContactoPage from './ContactoPage';

// --- COMPONENTE DE AYUDA PARA EL SCROLL ---
// (Podríamos poner esto en un archivo separado, pero es más fácil aquí)
function ScrollToTop() {
  const { pathname } = useLocation(); // Obtiene la ruta actual (ej. "/servicios")

  useEffect(() => {
    // "useEffect" que se ejecuta CADA VEZ que el 'pathname' cambia
    window.scrollTo(0, 0); // Hace scroll al top de la página
  }, [pathname]); // El array de dependencias.

  return null; // Este componente no renderiza nada visible
}
// ----------------------------------------

function App() {
  return (
    <div className="App">
      <Header />
      <ScrollToTop /> {/* <-- COMPONENTE AÑADIDO */}
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/nosotros" element={<NosotrosPage />} />
        <Route path="/servicios" element={<ServiciosPage />} />
        <Route path="/contacto" element={<ContactoPage />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;


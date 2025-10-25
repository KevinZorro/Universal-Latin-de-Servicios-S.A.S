import { useState } from 'react';
import FormularioServicio from './components/FormularioServicio';
import HomePage from './HomePage'; 
import Footer from './components/Footer';


function App() {
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null);

  return (
    <div className="App">
      <HomePage /> {}

      {servicioSeleccionado && (
        <FormularioServicio
          servicio={servicioSeleccionado}
          onClose={() => setServicioSeleccionado(null)}
        />
      )}
      <Footer />
    </div>
  );
}

export default App;

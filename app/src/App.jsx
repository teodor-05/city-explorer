import { useState } from 'react';
import { destinatii as destinatiiInitiale } from './data/destinatii.js';

import { getNevizitate, totalZile, marcheazaVizitat, adaugaDestinatie, stergeDestinatie } from './utils/destinatii.js';
import Rezumat from './components/Rezumat.jsx';
import FormularDestinatie from './components/FormularDestinatie.jsx';
import ListaDestinatii from './components/ListaDestinatii.jsx';
import './App.css';

export default function App() {
  const [destinatii, setDestinatii] = useState(destinatiiInitiale);

  const nevizitate = getNevizitate(destinatii);
  const numarNevizitate = nevizitate.length;
  const sumaZile = totalZile(nevizitate);

  const handleToggle = (id) => {
    setDestinatii((curent) => marcheazaVizitat(curent, id));
  };

  const handleAdd = (nouaDestinatie) => {
    setDestinatii((curent) => adaugaDestinatie(curent, nouaDestinatie));
  };

  const handleDelete = (id) => {
    setDestinatii((curent) => stergeDestinatie(curent, id));
  };

  return (
    <main>
      <h1>City Explorer</h1>
      <Rezumat 
        total={destinatii.length} 
        nevizitate={numarNevizitate} 
        zile={sumaZile} 
      />
      <FormularDestinatie onAdd={handleAdd} />
      <ListaDestinatii 
        destinatii={destinatii} 
        onToggle={handleToggle} 
        onDelete={handleDelete}
      />
    </main>
  );
}
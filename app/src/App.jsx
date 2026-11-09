import { useState, useEffect } from 'react';
import { getDestinatii, postDestinatie, patchVizitat, deleteDestinatie } from './api/destinatii.js';
import { getNevizitate, totalZile } from './utils/destinatii.js';
import Rezumat from './components/Rezumat.jsx';
import PanouStatistici from './components/PanouStatistici.jsx';
import FormularDestinatie from './components/FormularDestinatie.jsx';
import ListaDestinatii from './components/ListaDestinatii.jsx';
import Cautare from './components/Cautare.jsx';
import './App.css';

export default function App() {
  const [destinatii, setDestinatii] = useState([]);
  const [incarcare, setIncarcare] = useState(true);
  const [eroare, setEroare] = useState(null);
  const [cautare, setCautare] = useState('');
  const [seTrimite, setSeTrimite] = useState(false);

  useEffect(() => {
    async function incarca() {
      try {
        const date = await getDestinatii();
        setDestinatii(date);
      } catch (error) {
        setEroare(error.message);
      } finally {
        setIncarcare(false);
      }
    }
    incarca();
  }, []);

  const handleToggle = async (id) => {
    const dest = destinatii.find((d) => d.id === id);
    if (!dest) return;
    try {
      const salvata = await patchVizitat(id, !dest.vizitat);
      setDestinatii((curent) => curent.map((d) => (d.id === id ? salvata : d)));
    } catch (error) {
      console.error(error);
    }
  };

  const handleAdd = async (noua) => {
    setSeTrimite(true);
    try {
      const salvata = await postDestinatie(noua);
      setDestinatii((curent) => [...curent, salvata]);
    } catch (error) {
      console.error(error);
    } finally {
      setSeTrimite(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDestinatie(id);
      setDestinatii((curent) => curent.filter((d) => d.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  if (incarcare) return <p className="stare">Se încarcă destinațiile...</p>;
  if (eroare) return <p className="stare eroare">Nu am putut încărca datele: {eroare}</p>;

  const nevizitate = getNevizitate(destinatii);
  const textCauta = cautare.trim().toLowerCase();
  const afisate = destinatii.filter(
    (d) => d.oras.toLowerCase().includes(textCauta) || d.tara.toLowerCase().includes(textCauta)
  );

  return (
    <main>
      <h1>City Explorer</h1>
      <PanouStatistici />
      <Rezumat 
        total={destinatii.length} 
        nevizitate={nevizitate.length} 
        zile={totalZile(nevizitate)} 
      />
      <FormularDestinatie onAdd={handleAdd} seTrimite={seTrimite} />
      <Cautare valoare={cautare} onChange={setCautare} />
      
      {destinatii.length === 0 ? (
        <p className="gol">Nu există nicio destinație.<br/>Adaugă prima din formular.</p>
      ) : afisate.length === 0 ? (
        <p className="gol">Niciun rezultat pentru „{cautare}”.</p>
      ) : (
        <ListaDestinatii destinatii={afisate} onToggle={handleToggle} onDelete={handleDelete} />
      )}
    </main>
  );
}
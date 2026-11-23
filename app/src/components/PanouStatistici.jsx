import { useEffect, useState } from 'react';

export default function PanouStatistici() {
  const [statistici, setStatistici] = useState({ destinatii: 0, zile: 0, medie: 0 });
  const [incarcare, setIncarcare] = useState(true);
  const [eroare, setEroare] = useState(null);
  const [prag, setPrag] = useState('3');

  useEffect(() => {
    async function incarca() {
      setIncarcare(true);
      setEroare(null);
      try {
        // Noul link către backend-ul tău de pe portul 3000
        const response = await fetch(`http://localhost:3000/api/statistici?prag=${prag}`);
        if (!response.ok) {
          throw new Error(`Serverul a răspuns cu ${response.status}`);
        }
        const date = await response.json();
        // Serverul ne trimite direct obiectul { destinatii, zile, medie }
        setStatistici(date);
      } catch (err) {
        setEroare(err.message);
      } finally {
        setIncarcare(false);
      }
    }
    incarca();
  }, [prag]); // Adăugăm prag aici pentru ca datele să se reîncarce când schimbi numărul

  if (incarcare) {
    return <p className="stare">Se încarcă statisticile...</p>;
  }
  if (eroare) {
    return <p className="stare eroare">Statistici indisponibile: {eroare}</p>;
  }

  return (
    <section className="panou">
      <h2>Statistici</h2>
      <label>
        Cel puțin {' '}
        <input
          type="number"
          value={prag}
          onChange={(e) => setPrag(e.target.value)}
        />{' '}
        zile
      </label>

      {statistici.destinatii === 0 && (
        <p className="gol">Nicio destinație cu cel puțin {prag} zile.</p>
      )}

      {statistici.destinatii > 0 && (
        <ul>
          <li>Destinații: {statistici.destinatii}</li>
          <li>Total zile: {statistici.zile}</li>
          <li>Media: {statistici.medie} zile</li>
        </ul>
      )}
    </section>
  );
}
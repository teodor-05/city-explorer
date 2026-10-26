import { useState } from 'react';

export default function FormularDestinatie({ onAdd }) {
  const [oras, setOras] = useState('');
  const [tara, setTara] = useState('');
  const [zile, setZile] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!oras.trim() || !tara.trim()) return;

    const nouaDestinatie = {
      id: crypto.randomUUID(),
      oras,
      tara,
      zile: Number(zile) || 0,
      vizitat: false
    };

    onAdd(nouaDestinatie);
    setOras('');
    setTara('');
    setZile('');
  };

  return (
    <form className="formular" onSubmit={handleSubmit}>
      <input value={oras} onChange={(e) => setOras(e.target.value)} placeholder="Oraș" />
      <input value={tara} onChange={(e) => setTara(e.target.value)} placeholder="Țară" />
      <input type="number" value={zile} onChange={(e) => setZile(e.target.value)} placeholder="Zile" />
      <button type="submit">Adaugă</button>
    </form>
  );
}
import express from 'express';
import cors from 'cors';
import { pool } from './db.js';
import { jurnal } from './jurnal.js';
import statisticiRouter from './rute/statistici.js';
import jurnalRouter from './rute/jurnal.js';

const app = express();

// Middleware de debug (afișează fiecare cerere în consolă)
app.use((req, res, next) => {
  console.log(req.method, req.originalUrl);
  next();
});

// Ordinea corectă (Ex. 4d): Jurnalul trebuie să fie înaintea CORS
app.use(jurnal);
app.use(cors());
app.use(express.json());

// Montarea rutelor
app.use('/api/statistici', statisticiRouter);
app.use('/api/jurnal', jurnalRouter);

// Exercițiul 1c: Ruta de ecou
app.all('/api/ecou/:id', (req, res) => {
  res.json({ params: req.params, query: req.query, body: req.body });
});

// Exercițiul 1b: Citirea datelor din tabelă
app.get('/api/destinatii', async (req, res) => {
  const [randuri] = await pool.query(
    'SELECT id, oras, tara, zile, vizitat FROM destinatii ORDER BY id'
  );
  // MariaDB dă vizitat ca 0/1. Facem conversie.
  res.json(randuri.map((d) => ({ ...d, id: String(d.id), vizitat: Boolean(d.vizitat) })));
});

// Exercițiul 5a: Căutare pentru planul de execuție și Index
app.get('/api/destinatii/caut', async (req, res) => {
  const oras = req.query.oras || '';
  const [randuri] = await pool.query(
    'SELECT id, oras, tara, zile, vizitat FROM destinatii WHERE oras = ?',
    [oras]
  );
  res.json(randuri.map((d) => ({ ...d, id: String(d.id), vizitat: Boolean(d.vizitat) })));
});

// Exercițiul 2: Adăugarea unei destinații (POST)
app.post('/api/destinatii', async (req, res) => {
  const { oras, tara, zile } = req.body;
  const zileNum = Number(zile);

  // Validare Backend
  if (!oras || !tara || oras.trim().length < 2 || tara.trim() === '' || Number.isNaN(zileNum) || zileNum < 1 || zileNum > 30) {
    return res.status(400).json({ eroare: 'Date invalide.' });
  }

  const [rezultat] = await pool.query(
    'INSERT INTO destinatii (oras, tara, zile, vizitat) VALUES (?, ?, ?, ?)',
    [oras.trim(), tara.trim(), zileNum, false]
  );

  // Returnăm 201 Created și obiectul complet (inclusiv insertId)
  return res.status(201).json({
    id: String(rezultat.insertId),
    oras: oras.trim(),
    tara: tara.trim(),
    zile: zileNum,
    vizitat: false
  });
});

// Exercițiul 3a: Marcarea și legarea interfeței (PATCH)
app.patch('/api/destinatii/:id', async (req, res) => {
  const { vizitat } = req.body;
  const id = req.params.id;

  const [rezultat] = await pool.query(
    'UPDATE destinatii SET vizitat = ? WHERE id = ?',
    [vizitat, id]
  );

  // Dacă nu s-a actualizat nimic, ID-ul nu există
  if (rezultat.affectedRows === 0) {
    return res.status(404).json({ eroare: 'Destinația nu există.' });
  }

  // Se citește rândul modificat din DB
  const [randuri] = await pool.query('SELECT * FROM destinatii WHERE id = ?', [id]);
  const d = randuri[0];
  res.json({ ...d, id: String(d.id), vizitat: Boolean(d.vizitat) });
});

app.listen(3000, () => {
  console.log('API pornit pe http://localhost:3000');
});
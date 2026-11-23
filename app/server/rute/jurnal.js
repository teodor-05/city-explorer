import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

router.get('/raport', async (req, res) => {
  let sql = `
    SELECT metoda, cale, COUNT(*) AS cereri, ROUND(AVG(durata_ms), 1) AS medie_ms
    FROM jurnal
  `;
  const valori = [];

  // Ex. 4c - Filtrul corect, cu parametru "?"
  if (req.query.metoda) {
    sql += ' WHERE metoda = ?';
    valori.push(req.query.metoda);
  }

  sql += ' GROUP BY metoda, cale ORDER BY cereri DESC LIMIT 10';

  try {
    const [randuri] = await pool.query(sql, valori);
    // AVG sosește ca String, trebuie transformat în Number
    const rezultat = randuri.map(r => ({
      ...r,
      cereri: Number(r.cereri),
      medie_ms: Number(r.medie_ms)
    }));
    res.json(rezultat);
  } catch (error) {
    res.status(500).json({ eroare: 'Eroare la generarea raportului' });
  }
});

export default router;
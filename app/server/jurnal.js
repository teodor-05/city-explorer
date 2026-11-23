import { pool } from './db.js';

export function jurnal(req, res, next) {
  const inceput = process.hrtime.bigint();
  const cale = req.originalUrl; // Se citește aici pentru a evita modificarea în router

  res.on('finish', async () => {
    const durata_ms = Number(process.hrtime.bigint() - inceput) / 1e6;
    try {
      await pool.query(
        'INSERT INTO jurnal (metoda, cale, status, durata_ms) VALUES (?, ?, ?, ?)',
        [req.method, cale, res.statusCode, durata_ms]
      );
    } catch (error) {
      console.error('Eroare la scrierea în jurnal:', error);
    }
  });

  next();
}
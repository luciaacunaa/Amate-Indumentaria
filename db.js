const Database = require('better-sqlite3');
const path = require('path');
const crypto = require('crypto');
const { app } = require('electron');

const db = new Database(process.env.DB_PATH || path.join(app.getPath('userData'), 'amate.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS clientas (
    id TEXT PRIMARY KEY,
    nombre TEXT NOT NULL,
    dni TEXT NOT NULL,
    telefono TEXT NOT NULL,
    calle TEXT NOT NULL,
    numero TEXT NOT NULL,
    piso_depto TEXT,
    localidad TEXT NOT NULL,
    provincia TEXT NOT NULL,
    codigo_postal TEXT NOT NULL,
    creada_en INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS config (
    clave TEXT PRIMARY KEY,
    valor TEXT NOT NULL
  );
`);

const SELECT = `
  SELECT id, nombre, dni, telefono, calle, numero,
         piso_depto AS pisoDepto, localidad, provincia,
         codigo_postal AS codigoPostal, creada_en AS creadaEn
  FROM clientas
`;

const params = (c) => ({
  nombre: c.nombre, dni: c.dni, telefono: c.telefono,
  calle: c.calle, numero: c.numero, pisoDepto: c.pisoDepto || '',
  localidad: c.localidad, provincia: c.provincia, codigoPostal: c.codigoPostal,
});

module.exports = {
  listar: () => db.prepare(`${SELECT} ORDER BY creada_en DESC`).all(),

  obtener: (id) => db.prepare(`${SELECT} WHERE id = ?`).get(id),

  crear(c) {
    const id = crypto.randomUUID();
    db.prepare(`
      INSERT INTO clientas (id, nombre, dni, telefono, calle, numero, piso_depto, localidad, provincia, codigo_postal, creada_en)
      VALUES (@id, @nombre, @dni, @telefono, @calle, @numero, @pisoDepto, @localidad, @provincia, @codigoPostal, @creadaEn)
    `).run({ id, creadaEn: Date.now(), ...params(c) });
    return this.obtener(id);
  },

  editar(id, c) {
    db.prepare(`
      UPDATE clientas SET nombre=@nombre, dni=@dni, telefono=@telefono, calle=@calle,
        numero=@numero, piso_depto=@pisoDepto, localidad=@localidad,
        provincia=@provincia, codigo_postal=@codigoPostal
      WHERE id=@id
    `).run({ id, ...params(c) });
  },

  eliminar: (id) => db.prepare('DELETE FROM clientas WHERE id = ?').run(id),

  getConfig(clave, defecto) {
    const fila = db.prepare('SELECT valor FROM config WHERE clave = ?').get(clave);
    return fila ? JSON.parse(fila.valor) : defecto;
  },

  setConfig(clave, valor) {
    db.prepare('INSERT OR REPLACE INTO config (clave, valor) VALUES (?, ?)')
      .run(clave, JSON.stringify(valor));
  },
};
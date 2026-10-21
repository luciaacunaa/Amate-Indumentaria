const { test, expect, _electron: electron } = require('@playwright/test');
const os = require('os');
const path = require('path');

const base = {
  dni: '40123456',
  telefono: '1123456789',
  calle: 'Av. Siempre Viva',
  numero: '742',
  localidad: 'Lomas de Zamora',
  provincia: 'Buenos Aires',
  codigoPostal: '1832',
};

const lanzar = async (dbPath) => {
  const env = { ...process.env, DB_PATH: dbPath };
  delete env.ELECTRON_RUN_AS_NODE;
  const app = await electron.launch({ args: ['.'], env });
  const page = await app.firstWindow();
  await expect(page.getByText('Cargando…')).toHaveCount(0, { timeout: 30000 });
  return { app, page };
};

async function crearClienta(page, nombre) {
  await page.getByRole('button', { name: 'Nueva clienta' }).click();
  const datos = { nombre, ...base };
  for (const [k, v] of Object.entries(datos)) await page.fill(`[name=${k}]`, v);
  await page.getByRole('button', { name: 'Guardar clienta' }).click();
  await expect(page.getByText(nombre)).toBeVisible();
}

test('búsqueda exitosa y fallida', async () => {
  const dbPath = path.join(os.tmpdir(), `test-${Date.now()}.db`);
  const { app, page } = await lanzar(dbPath);

  await crearClienta(page, 'Lucia Paredes');
  await crearClienta(page, 'Ana Gómez');

  const buscador = page.getByPlaceholder('Buscar por nombre');

  // Búsqueda exitosa: aparece solo la clienta buscada
  await buscador.fill('Lucia Paredes');
  await page.getByRole('button', { name: 'Buscar', exact: true }).click();
  await expect(page.getByText('Lucia Paredes')).toBeVisible();
  await expect(page.getByText('Ana Gómez')).toHaveCount(0);

  // Búsqueda fallida: muestra el mensaje
  await buscador.fill('Abril Acuña');
  await page.getByRole('button', { name: 'Buscar', exact: true }).click();
  await expect(
    page.getByText('No se encontró un cliente con esas características'),
  ).toBeVisible();
  await expect(page.getByText('Lucia Paredes')).toHaveCount(0);

  await app.close();
});
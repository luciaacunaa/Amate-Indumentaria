const { test, expect, _electron: electron } = require('@playwright/test');
const os = require('os');
const path = require('path');

const datos = {
  nombre: 'Lucia Acuña',
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

test('alta de clienta: valida campos y queda guardada en la base', async () => {
  const dbPath = path.join(os.tmpdir(), `test-${Date.now()}.db`);

  let { app, page } = await lanzar(dbPath);

  // Con campos vacíos avisa qué falta
  await page.getByRole('button', { name: 'Nueva clienta' }).click();
  await page.getByRole('button', { name: 'Guardar clienta' }).click();
  await expect(page.getByText('Falta completar')).toBeVisible();

  // Completo y guardo
  for (const [k, v] of Object.entries(datos)) await page.fill(`[name=${k}]`, v);
  await page.getByRole('button', { name: 'Guardar clienta' }).click();
  await expect(page.getByText('Lucia Acuña')).toBeVisible();
  await app.close();

  // Reabro la app: la clienta tiene que seguir (viene de SQLite)
  ({ app, page } = await lanzar(dbPath));
  await expect(page.getByText('Lucia Acuña')).toBeVisible();
  await app.close();
});
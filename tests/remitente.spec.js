const { test, expect, _electron: electron } = require('@playwright/test');
const os = require('os');
const path = require('path');

const datos = {
  nombre: 'Rosana Gómez',
  dni: '20111222',
  cuit: '27201112223',
  direccion: 'Madreselva 645',
  codigoPostal: '1771',
  localidad: 'Mercado Central',
  provincia: 'Bs As',
  telefono: '1134212331',
  subCuenta: '43125',
  sucursal: 'Sucursal',
};

const lanzar = async (dbPath) => {
  const env = { ...process.env, DB_PATH: dbPath };
  delete env.ELECTRON_RUN_AS_NODE;
  const app = await electron.launch({ args: ['.'], env });
  const page = await app.firstWindow();
  // Espera a que la pantalla termine de cargar
  await expect(page.getByText('Cargando…')).toHaveCount(0, { timeout: 30000 });
  return { app, page };
};

test('guarda el remitente y lo recupera al reabrir', async () => {
  const dbPath = path.join(os.tmpdir(), `test-${Date.now()}.db`);

  let { app, page } = await lanzar(dbPath);

  // Con campos vacíos avisa qué falta
  await page.getByRole('button', { name: 'Datos del remitente' }).click();
  await page.getByRole('button', { name: 'Guardar remitente' }).click();
  await expect(page.getByText('Falta completar')).toBeVisible();

  // Completo y guardo
  for (const [k, v] of Object.entries(datos)) await page.fill(`[name=${k}]`, v);
  await page.getByRole('button', { name: 'Guardar remitente' }).click();
  await expect(page.getByText('Falta completar')).toHaveCount(0);
  await app.close();

  // Reabro la app y verifico que sigan los datos
  ({ app, page } = await lanzar(dbPath));
  await page.getByRole('button', { name: 'Datos del remitente' }).click();
  for (const [k, v] of Object.entries(datos)) {
    await expect(page.locator(`[name=${k}]`)).toHaveValue(v);
  }
  await app.close();
});
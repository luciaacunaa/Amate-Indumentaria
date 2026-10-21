const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

const OBLIGATORIOS = ['nombre', 'dni', 'telefono', 'calle', 'numero', 'localidad', 'provincia', 'codigoPostal'];
const REMITENTE_OBLIGATORIOS = ['nombre', 'dni', 'cuit', 'direccion', 'codigoPostal', 'localidad', 'provincia', 'telefono', 'subCuenta', 'sucursal'];

function validar(data) {
  for (const campo of OBLIGATORIOS) {
    if (!data[campo] || !String(data[campo]).trim()) throw new Error(`Falta ${campo}`);
  }
}

app.whenReady().then(() => {
  const db = require('./db');

  ipcMain.handle('clientas:listar', () => db.listar());
  ipcMain.handle('clientas:buscar', (_e, texto) => db.buscar(texto));

  ipcMain.handle('clientas:crear', (_e, data) => {
    validar(data);
    return db.crear(data);
  });

  ipcMain.handle('clientas:editar', (_e, id, data) => {
    validar(data);
    db.editar(id, data);
  });

  ipcMain.handle('clientas:eliminar', (_e, id) => db.eliminar(id));

  ipcMain.handle('remitente:obtener', () => db.getConfig('remitente', null));
  ipcMain.handle('remitente:guardar', (_e, r) => {
    for (const campo of REMITENTE_OBLIGATORIOS) {
      if (!r[campo] || !String(r[campo]).trim()) throw new Error(`Falta ${campo}`);
    }
    db.setConfig('remitente', r);
  });

  ipcMain.handle('pedido:obtener', () => db.getConfig('proximoPedido', 1));
  ipcMain.handle('pedido:consumir', () => {
    const actual = db.getConfig('proximoPedido', 1);
    db.setConfig('proximoPedido', actual + 1);
    return actual;
  });

  ipcMain.handle('etiquetas:imprimir', (e) =>
    new Promise((resolve) => {
      e.sender.print(
        { silent: false, printBackground: true, pageSize: 'A4' },
        (exito, motivo) => resolve({ exito, motivo: motivo || '' }),
      );
    }),
  );

  // Guarda la etiqueta como PDF en la carpeta que elija el usuario
  ipcMain.handle('etiquetas:pdf', async (e, nombreSugerido) => {
    const ventana = BrowserWindow.fromWebContents(e.sender);
    const { canceled, filePath } = await dialog.showSaveDialog(ventana, {
      title: 'Guardar etiqueta',
      defaultPath: `${nombreSugerido}.pdf`,
      filters: [{ name: 'PDF', extensions: ['pdf'] }],
    });
    if (canceled || !filePath) return null;

    const pdf = await e.sender.printToPDF({
      printBackground: true,
      pageSize: 'A4',
      preferCSSPageSize: true,
    });
    fs.writeFileSync(filePath, pdf);
    return filePath;
  });

  const win = new BrowserWindow({
    width: 1100,
    height: 800,
    webPreferences: { preload: path.join(__dirname, 'preload.js') },
  });
  win.loadURL(process.env.APP_URL || 'http://localhost:3000');
});

app.on('window-all-closed', () => app.quit());
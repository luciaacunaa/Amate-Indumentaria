const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  listarClientas: () => ipcRenderer.invoke('clientas:listar'),
  crearClienta: (d) => ipcRenderer.invoke('clientas:crear', d),
  editarClienta: (id, d) => ipcRenderer.invoke('clientas:editar', id, d),
  eliminarClienta: (id) => ipcRenderer.invoke('clientas:eliminar', id),
  obtenerRemitente: () => ipcRenderer.invoke('remitente:obtener'),
  guardarRemitente: (r) => ipcRenderer.invoke('remitente:guardar', r),
  obtenerPedido: () => ipcRenderer.invoke('pedido:obtener'),
  consumirPedido: () => ipcRenderer.invoke('pedido:consumir'),
});
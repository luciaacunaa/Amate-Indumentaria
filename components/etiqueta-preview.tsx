import type { Cliente, DatosEnvio, Remitente } from "@/lib/types"

type EtiquetaPreviewProps = {
  cliente: Cliente
  remitente: Remitente
  datos: DatosEnvio
}

function direccionCompleta(c: Cliente) {
  const partes = [c.calle, c.numero].filter(Boolean).join(" ")
  return [partes, c.pisoDepto].filter(Boolean).join(" - ")
}

function ubicacion(c: Cliente) {
  return [c.localidad, c.provincia].filter(Boolean).join(", ")
}

export function EtiquetaPreview({ cliente, remitente, datos }: EtiquetaPreviewProps) {
  if (datos.empresa === "Viacargo") {
    return <EtiquetaViacargo cliente={cliente} remitente={remitente} datos={datos} />
  }
  return <EtiquetaCorreo cliente={cliente} remitente={remitente} datos={datos} />
}

/* --- Viacargo: formato "ENVIO" --- */
function EtiquetaViacargo({ cliente, remitente, datos }: EtiquetaPreviewProps) {
  return (
    <div className="mx-auto w-full max-w-xl bg-white font-sans text-black">
      <table className="w-full border-collapse text-[15px] leading-tight">
        <tbody>
          <tr>
            <td colSpan={3} className="border-2 border-black px-3 py-2 text-center">
              <span className="text-3xl font-bold tracking-wide">ENVIO</span>
            </td>
          </tr>
          <tr>
            <td colSpan={2} className="h-40 border-2 border-black px-3 py-2 align-top">
              <p className="text-sm font-semibold">PARA:</p>
              <p className="mt-2 text-xl font-bold leading-snug">{cliente.nombre}</p>
              <div className="mt-1 space-y-0.5 text-[15px]">
                {direccionCompleta(cliente) && <p>Dirección: {direccionCompleta(cliente)}</p>}
                {ubicacion(cliente) && <p>{ubicacion(cliente)}</p>}
                {cliente.codigoPostal && <p>CP: {cliente.codigoPostal}</p>}
                {cliente.dni && <p>DNI: {cliente.dni}</p>}
                {cliente.telefono && <p>Tel: {cliente.telefono}</p>}
              </div>
            </td>
            <td className="w-40 border-2 border-black px-3 py-2 align-top">
              <p className="text-sm font-semibold">KILOS:</p>
              <p className="mt-2 text-lg font-bold">{datos.kilos}</p>
            </td>
          </tr>
          <tr>
            <td className="border-2 border-black px-3 py-2 align-top">
              <p className="text-sm font-semibold">DE:</p>
              <div className="mt-2 space-y-0.5 text-[15px]">
                {remitente.nombre && <p className="font-semibold">{remitente.nombre}</p>}
                {remitente.dni && <p>DNI: {remitente.dni}</p>}
                {remitente.codigoPostal && <p>CP: {remitente.codigoPostal}</p>}
                {remitente.direccion && <p>Dirección: {remitente.direccion}</p>}
              </div>
            </td>
            <td className="border-2 border-black px-3 py-2 align-top">
              <p className="text-sm font-semibold">EXPRESO:</p>
              <p className="mt-2 font-bold">{datos.expreso}</p>
            </td>
            <td className="border-2 border-black px-3 py-2 align-top">
              <p className="text-sm font-semibold leading-tight">CANTIDAD DE BULTOS:</p>
              <p className="mt-2 text-lg font-bold">{datos.bultos}</p>
            </td>
          </tr>
        </tbody>
      </table>
      <p className="mt-1 text-xs">MANIPULAR LA MERCANCIA CON PRECAUCIÓN.</p>
      <PieInterno datos={datos} />
    </div>
  )
}

/* --- Correo Argentino: formato REMITENTE / DESTINATARIO --- */
function EtiquetaCorreo({ cliente, remitente, datos }: EtiquetaPreviewProps) {
  const lineaUbicacion = [
    remitente.codigoPostal && `C.P. ${remitente.codigoPostal}`,
    remitente.localidad,
    remitente.provincia,
    remitente.cuit && `Cuit: ${remitente.cuit}`,
  ]
    .filter(Boolean)
    .join("        ")

  const lineaContacto = [
    remitente.telefono && `Tel. ${remitente.telefono}`,
    remitente.subCuenta && `Sub-Cuenta ${remitente.subCuenta}`,
  ]
    .filter(Boolean)
    .join("        ")

  return (
    <div className="mx-auto w-full max-w-xl bg-white font-sans text-black">
      <div className="mb-3 flex justify-center">
        {/* Logo oficial de Correo Argentino (extraído de la plantilla) */}
        <img
          src="/logo-correo-argentino.jpg"
          alt="Correo Argentino"
          className="h-14 w-auto"
        />
      </div>
      <table className="w-full border-collapse text-[15px] leading-tight">
        <tbody>
          <tr>
            <td className="w-32 border-2 border-black px-3 py-2 align-top font-semibold">
              REMITENTE
            </td>
            <td className="border-2 border-black px-3 py-2 align-top">
              <p className="font-bold">{remitente.nombre}</p>
              {remitente.sucursal && <p className="font-bold">{remitente.sucursal}</p>}
              {lineaUbicacion && <p className="mt-1 font-semibold">{lineaUbicacion}</p>}
              {lineaContacto && <p className="font-semibold">{lineaContacto}</p>}
            </td>
          </tr>
          <tr>
            <td colSpan={2} className="border-2 border-black px-3 py-2">
              <ul className="space-y-1">
                <li
                  className={
                    datos.modalidad === "Encomienda A SUCURSAL con PAGO EN DESTINO"
                      ? "font-bold"
                      : ""
                  }
                >
                  <Marca activa={datos.modalidad === "Encomienda A SUCURSAL con PAGO EN DESTINO"} />{" "}
                  Encomienda A SUCURSAL con PAGO EN DESTINO
                </li>
                <li className={datos.modalidad === "SE RETIRA Y ABONA EN SUCURSAL" ? "font-bold" : ""}>
                  <Marca activa={datos.modalidad === "SE RETIRA Y ABONA EN SUCURSAL"} /> SE RETIRA Y
                  ABONA EN SUCURSAL
                </li>
                <li className={datos.modalidad === "NO se debe cobrar" ? "font-bold" : ""}>
                  <Marca activa={datos.modalidad === "NO se debe cobrar"} /> NO se debe cobrar
                </li>
                <li className={datos.modalidad === "POSTE RESTANTE" ? "font-bold" : ""}>
                  <Marca activa={datos.modalidad === "POSTE RESTANTE"} /> POSTE RESTANTE
                </li>
              </ul>
            </td>
          </tr>
          <tr>
            <td className="w-32 border-2 border-black px-3 py-2 align-top font-semibold">
              DESTINATARIO
            </td>
            <td className="h-32 border-2 border-black px-3 py-2 align-top">
              <p className="text-lg font-bold leading-snug">{cliente.nombre}</p>
              <div className="mt-1 space-y-0.5">
                {direccionCompleta(cliente) && <p>Dirección: {direccionCompleta(cliente)}</p>}
                {ubicacion(cliente) && <p>{ubicacion(cliente)}</p>}
                {cliente.codigoPostal && <p>C.P. {cliente.codigoPostal}</p>}
                {cliente.dni && <p>DNI: {cliente.dni}</p>}
                {cliente.telefono && <p>Tel. {cliente.telefono}</p>}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <PieInterno datos={datos} />
    </div>
  )
}

function Marca({ activa }: { activa: boolean }) {
  return (
    <span className="mr-1 inline-flex size-4 items-center justify-center border border-black text-[11px] font-bold leading-none">
      {activa ? "X" : ""}
    </span>
  )
}

function PieInterno({ datos }: { datos: DatosEnvio }) {
  if (!datos.nroPedido && !datos.fecha) return null
  return (
    <div className="mt-1 flex items-center justify-between text-[11px] text-black/60">
      {datos.nroPedido ? <span>Pedido N° {datos.nroPedido}</span> : <span />}
      {datos.fecha ? <span>{datos.fecha}</span> : <span />}
    </div>
  )
}

export type Cliente = {
  id: string
  nombre: string
  dni: string
  telefono: string
  calle: string
  numero: string
  pisoDepto: string
  localidad: string
  provincia: string
  codigoPostal: string
  creadaEn: number
}

export type Empresa = "Viacargo" | "Correo Argentino"

export const EMPRESAS: Empresa[] = ["Viacargo", "Correo Argentino"]

export type Remitente = {
  nombre: string
  dni: string
  cuit: string
  telefono: string
  direccion: string
  codigoPostal: string
  localidad: string
  provincia: string
  sucursal: string
  subCuenta: string
}

export type ModalidadCorreo =
  | "Encomienda A SUCURSAL con PAGO EN DESTINO"
  | "SE RETIRA Y ABONA EN SUCURSAL"
  | "NO se debe cobrar"
  | "POSTE RESTANTE"

export const MODALIDADES_CORREO: ModalidadCorreo[] = [
  "Encomienda A SUCURSAL con PAGO EN DESTINO",
  "SE RETIRA Y ABONA EN SUCURSAL",
  "NO se debe cobrar",
  "POSTE RESTANTE",
]

export type DatosEnvio = {
  empresa: Empresa
  nroPedido: string
  fecha: string
  kilos: string
  bultos: string
  expreso: string
  modalidad: ModalidadCorreo
}

export type ClienteFormValues = Omit<Cliente, "id" | "creadaEn">

export const clienteVacio: ClienteFormValues = {
  nombre: "",
  dni: "",
  telefono: "",
  calle: "",
  numero: "",
  pisoDepto: "",
  localidad: "",
  provincia: "",
  codigoPostal: "",
}

export const remitentePorDefecto: Remitente = {
  nombre: "",
  dni: "",
  cuit: "",
  telefono: "",
  direccion: "",
  codigoPostal: "",
  localidad: "",
  provincia: "",
  sucursal: "Sucursal",
  subCuenta: "",
}

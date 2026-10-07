"use client"

import { useEffect, useState } from "react"
import { Printer } from "lucide-react"
import { Modal } from "@/components/modal"
import { Field } from "@/components/field"
import { EtiquetaPreview } from "@/components/etiqueta-preview"
import { Button } from "@/components/ui/button"
import {
  EMPRESAS,
  MODALIDADES_CORREO,
  type Cliente,
  type Empresa,
  type ModalidadCorreo,
  type Remitente,
} from "@/lib/types"
import { cn } from "@/lib/utils"

type EtiquetaDialogProps = {
  cliente: Cliente | null
  remitente: Remitente
  sugerenciaPedido: number
  onCerrar: () => void
  onImpreso: () => void
}

const CAMPOS_CLIENTE: [keyof Cliente, string][] = [
  ["nombre", "Nombre"],
  ["dni", "DNI"],
  ["telefono", "Teléfono"],
  ["calle", "Calle"],
  ["numero", "Número"],
  ["localidad", "Localidad"],
  ["provincia", "Provincia"],
  ["codigoPostal", "Código postal"],
]

const CAMPOS_REMITENTE: [keyof Remitente, string][] = [
  ["nombre", "Nombre y apellido"],
  ["dni", "DNI"],
  ["cuit", "CUIT"],
  ["direccion", "Dirección"],
  ["codigoPostal", "Código postal"],
  ["localidad", "Localidad"],
  ["provincia", "Provincia"],
]

const CAMPOS_REMITENTE_CORREO: [keyof Remitente, string][] = [
  ["telefono", "Teléfono"],
  ["subCuenta", "Sub-cuenta"],
  ["sucursal", "Sucursal / modalidad de entrega"],
]

const vacio = (valor: unknown) => !String(valor ?? "").trim()

function hoyISO() {
  const d = new Date()
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10)
}

function formatearFecha(iso: string) {
  if (!iso) return ""
  const [a, m, d] = iso.split("-")
  return `${d}/${m}/${a}`
}

export function EtiquetaDialog({
  cliente,
  remitente,
  sugerenciaPedido,
  onCerrar,
  onImpreso,
}: EtiquetaDialogProps) {
  const [empresa, setEmpresa] = useState<Empresa>("Viacargo")
  const [nroPedido, setNroPedido] = useState("")
  const [fecha, setFecha] = useState(hoyISO())
  const [kilos, setKilos] = useState("")
  const [bultos, setBultos] = useState("1")
  const [expreso, setExpreso] = useState("")
  const [modalidad, setModalidad] = useState<ModalidadCorreo>(MODALIDADES_CORREO[1])
  const [error, setError] = useState("")

  useEffect(() => {
    if (cliente) {
      setEmpresa("Viacargo")
      setNroPedido(String(sugerenciaPedido).padStart(4, "0"))
      setFecha(hoyISO())
      setKilos("")
      setBultos("1")
      setExpreso("")
      setModalidad(MODALIDADES_CORREO[1])
      setError("")
    }
  }, [cliente, sugerenciaPedido])

  if (!cliente) return null

  const c = cliente
  const esViacargo = empresa === "Viacargo"

  const datosFaltantes = () => {
    const faltan: string[] = []

    for (const [campo, label] of CAMPOS_CLIENTE) {
      if (vacio(c[campo])) faltan.push(`${label} de la clienta`)
    }

    const camposRemitente = esViacargo
      ? CAMPOS_REMITENTE
      : [...CAMPOS_REMITENTE, ...CAMPOS_REMITENTE_CORREO]
    for (const [campo, label] of camposRemitente) {
      if (vacio(remitente[campo])) faltan.push(`${label} del remitente`)
    }

    if (vacio(nroPedido)) faltan.push("N° de pedido")
    if (vacio(fecha)) faltan.push("Fecha de envío")
    if (esViacargo && vacio(bultos)) faltan.push("Cantidad de bultos")

    return faltan
  }

  const imprimir = () => {
    const faltan = datosFaltantes()
    if (faltan.length > 0) {
      setError(`No se puede generar la etiqueta. Falta completar: ${faltan.join(", ")}.`)
      return
    }
    setError("")
    window.print()
    onImpreso()
  }

  return (
    <Modal
      open={!!cliente}
      onClose={onCerrar}
      title="Generar etiqueta"
      description="Elegí la empresa y revisá los datos antes de imprimir."
      size="lg"
    >
      <div className="flex flex-col gap-5">
        <div className="no-imprimir flex flex-col gap-4">
          <div>
            <p className="mb-1.5 text-sm font-semibold text-foreground/80">Empresa de envío</p>
            <div className="grid grid-cols-2 gap-2">
              {EMPRESAS.map((op) => (
                <button
                  key={op}
                  type="button"
                  onClick={() => setEmpresa(op)}
                  className={cn(
                    "rounded-lg border-2 px-4 py-3 text-sm font-semibold transition-colors",
                    empresa === op
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-input bg-white text-foreground hover:border-primary/50",
                  )}
                >
                  {op}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field
              label="N° de pedido / seguimiento"
              name="nroPedido"
              value={nroPedido}
              onChange={(e) => setNroPedido(e.target.value)}
            />
            <Field
              label="Fecha de envío"
              name="fecha"
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
          </div>

          {esViacargo ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field
                label="Kilos"
                name="kilos"
                value={kilos}
                onChange={(e) => setKilos(e.target.value)}
                placeholder="Opcional"
              />
              <Field
                label="Cantidad de bultos"
                name="bultos"
                value={bultos}
                onChange={(e) => setBultos(e.target.value)}
              />
              <Field
                label="Expreso"
                name="expreso"
                value={expreso}
                onChange={(e) => setExpreso(e.target.value)}
                placeholder="Opcional"
              />
            </div>
          ) : (
            <div>
              <p className="mb-1.5 text-sm font-semibold text-foreground/80">Modalidad</p>
              <div className="flex flex-col gap-2">
                {MODALIDADES_CORREO.slice(1).map((op) => (
                  <button
                    key={op}
                    type="button"
                    onClick={() => setModalidad(op)}
                    className={cn(
                      "rounded-lg border-2 px-3 py-2 text-left text-sm font-medium transition-colors",
                      modalidad === op
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-input bg-white text-foreground hover:border-primary/50",
                    )}
                  >
                    {op}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div id="zona-impresion">
          <EtiquetaPreview
            cliente={cliente}
            remitente={remitente}
            datos={{
              empresa,
              nroPedido,
              fecha: formatearFecha(fecha),
              kilos,
              bultos,
              expreso,
              modalidad,
            }}
          />
        </div>

        {error && (
          <p role="alert" className="no-imprimir text-sm font-semibold text-destructive">
            {error}
          </p>
        )}

        <div className="no-imprimir flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={onCerrar}>
            Cerrar
          </Button>
          <Button
            type="button"
            onClick={imprimir}
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Printer className="size-4" />
            Imprimir etiqueta
          </Button>
        </div>
      </div>
    </Modal>
  )
}
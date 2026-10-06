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

  useEffect(() => {
    if (cliente) {
      setEmpresa("Viacargo")
      setNroPedido(String(sugerenciaPedido).padStart(4, "0"))
      setFecha(hoyISO())
      setKilos("")
      setBultos("1")
      setExpreso("")
      setModalidad(MODALIDADES_CORREO[1])
    }
  }, [cliente, sugerenciaPedido])

  if (!cliente) return null

  const imprimir = () => {
    window.print()
    onImpreso()
  }

  const esViacargo = empresa === "Viacargo"

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

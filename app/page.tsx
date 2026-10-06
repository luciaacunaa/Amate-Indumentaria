"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { Plus, Search, Store } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/modal"
import { ClienteForm } from "@/components/cliente-form"
import { ClienteList } from "@/components/cliente-list"
import { RemitenteForm } from "@/components/remitente-form"
import { EtiquetaDialog } from "@/components/etiqueta-dialog"
import { useClientes } from "@/hooks/use-clientes"
import type { Cliente, ClienteFormValues } from "@/lib/types"

export default function Page() {
  const {
    clientes,
    remitente,
    proximoPedido,
    cargado,
    agregarCliente,
    editarCliente,
    eliminarCliente,
    guardarRemitente,
    consumirNroPedido,
  } = useClientes()

  const [busqueda, setBusqueda] = useState("")
  const [formAbierto, setFormAbierto] = useState(false)
  const [enEdicion, setEnEdicion] = useState<Cliente | null>(null)
  const [remitenteAbierto, setRemitenteAbierto] = useState(false)
  const [clienteEtiqueta, setClienteEtiqueta] = useState<Cliente | null>(null)

  const filtradas = useMemo(() => {
    const q = busqueda.trim().toLowerCase()
    if (!q) return clientes
    return clientes.filter((c) =>
      [c.nombre, c.dni, c.localidad, c.provincia, c.telefono]
        .filter(Boolean)
        .some((v) => v.toLowerCase().includes(q)),
    )
  }, [clientes, busqueda])

  const abrirNueva = () => {
    setEnEdicion(null)
    setFormAbierto(true)
  }

  const guardarCliente = (valores: ClienteFormValues) => {
    if (enEdicion) editarCliente(enEdicion.id, valores)
    else agregarCliente(valores)
    setFormAbierto(false)
    setEnEdicion(null)
  }

  const confirmarEliminar = (cliente: Cliente) => {
    if (window.confirm(`¿Eliminar a ${cliente.nombre}? Esta acción no se puede deshacer.`)) {
      eliminarCliente(cliente.id)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="no-imprimir border-b border-border bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/logo-amate.jpg"
              alt="Logo Amate Indumentaria"
              width={52}
              height={52}
              className="size-[52px] rounded-full object-cover ring-2 ring-white/70"
              priority
            />
            <div>
              <h1 className="font-brand text-3xl leading-none">Amate Indumentaria</h1>
              <p className="text-sm text-primary-foreground/80">Etiquetas de envío</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => setRemitenteAbierto(true)}
            className="gap-2 border-white/40 bg-white/10 text-primary-foreground hover:bg-white/20 hover:text-primary-foreground"
          >
            <Store className="size-4" />
            Datos del remitente
          </Button>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-6">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-foreground">Mis clientas</h2>
            <p className="text-sm text-muted-foreground">
              {cargado ? `${clientes.length} guardada${clientes.length === 1 ? "" : "s"}` : "Cargando…"}
            </p>
          </div>
          <Button
            onClick={abrirNueva}
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="size-4" />
            Nueva clienta
          </Button>
        </div>

        <div className="relative mb-5">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre, DNI o localidad…"
            className="h-11 w-full rounded-xl border border-input bg-card pl-10 pr-4 text-sm text-foreground shadow-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/25"
          />
        </div>

        <ClienteList
          clientes={filtradas}
          onGenerar={setClienteEtiqueta}
          onEditar={(c) => {
            setEnEdicion(c)
            setFormAbierto(true)
          }}
          onEliminar={confirmarEliminar}
        />
      </div>

      <Modal
        open={formAbierto}
        onClose={() => {
          setFormAbierto(false)
          setEnEdicion(null)
        }}
        title={enEdicion ? "Editar clienta" : "Nueva clienta"}
        description="Los datos se guardan para reusarlos en cada envío."
        size="lg"
      >
        <ClienteForm
          valorInicial={enEdicion ?? undefined}
          onGuardar={guardarCliente}
          onCancelar={() => {
            setFormAbierto(false)
            setEnEdicion(null)
          }}
        />
      </Modal>

      <Modal
        open={remitenteAbierto}
        onClose={() => setRemitenteAbierto(false)}
        title="Datos del remitente"
      >
        <RemitenteForm
          valorInicial={remitente}
          onGuardar={(v) => {
            guardarRemitente(v)
            setRemitenteAbierto(false)
          }}
          onCancelar={() => setRemitenteAbierto(false)}
        />
      </Modal>

      <EtiquetaDialog
        cliente={clienteEtiqueta}
        remitente={remitente}
        sugerenciaPedido={proximoPedido}
        onCerrar={() => setClienteEtiqueta(null)}
        onImpreso={consumirNroPedido}
      />
    </main>
  )
}

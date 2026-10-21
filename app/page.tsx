"use client"

import { useEffect, useState } from "react"
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
  const [resultados, setResultados] = useState<Cliente[]>([])
  const [formAbierto, setFormAbierto] = useState(false)
  const [enEdicion, setEnEdicion] = useState<Cliente | null>(null)
  const [remitenteAbierto, setRemitenteAbierto] = useState(false)
  const [clienteEtiqueta, setClienteEtiqueta] = useState<Cliente | null>(null)

  // Busca en SQLite mientras se escribe (y cuando cambia la lista de clientas)
  useEffect(() => {
    if (!cargado) return
    let vigente = true
    window.api.buscarClientas(busqueda).then((r) => {
      if (vigente) setResultados(r)
    })
    return () => {
      vigente = false
    }
  }, [busqueda, clientes, cargado])

  // Botón "Buscar" (o Enter)
  const buscar = async () => {
    setResultados(await window.api.buscarClientas(busqueda))
  }

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

        <form
          onSubmit={(e) => {
            e.preventDefault()
            buscar()
          }}
          className="mb-5 flex gap-2"
        >
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre, DNI o localidad…"
              className="h-11 w-full rounded-xl border border-input bg-card pl-10 pr-4 text-sm text-foreground shadow-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/25"
            />
          </div>
          <Button
            type="submit"
            className="h-11 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Buscar
          </Button>
        </form>

        <ClienteList
          clientes={resultados}
          hayBusqueda={busqueda.trim() !== ""}
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
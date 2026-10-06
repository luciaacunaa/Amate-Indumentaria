"use client"

import { MapPin, Phone, Pencil, Trash2, Printer, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Cliente } from "@/lib/types"

type ClienteListProps = {
  clientes: Cliente[]
  onGenerar: (cliente: Cliente) => void
  onEditar: (cliente: Cliente) => void
  onEliminar: (cliente: Cliente) => void
}

export function ClienteList({ clientes, onGenerar, onEditar, onEliminar }: ClienteListProps) {
  if (clientes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border bg-card/60 px-6 py-16 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-secondary text-primary">
          <Users className="size-7" />
        </div>
        <p className="text-lg font-bold text-foreground">Todavía no hay clientas</p>
        <p className="max-w-xs text-sm text-muted-foreground">
          Agregá tu primera clienta y sus datos quedarán guardados para generar etiquetas al instante.
        </p>
      </div>
    )
  }

  return (
    <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {clientes.map((c) => (
        <li
          key={c.id}
          className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-lg font-bold text-foreground">{c.nombre}</p>
              {c.dni ? <p className="text-xs text-muted-foreground">DNI {c.dni}</p> : null}
            </div>
            <div className="flex shrink-0 gap-1">
              <button
                onClick={() => onEditar(c)}
                className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-primary"
                aria-label={`Editar ${c.nombre}`}
              >
                <Pencil className="size-4" />
              </button>
              <button
                onClick={() => onEliminar(c)}
                className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                aria-label={`Eliminar ${c.nombre}`}
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 text-sm text-muted-foreground">
            <p className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary/60" />
              <span>
                {[c.calle, c.numero].filter(Boolean).join(" ")}
                {c.pisoDepto ? ` · ${c.pisoDepto}` : ""}
                {c.localidad ? `, ${c.localidad}` : ""}
                {c.provincia ? `, ${c.provincia}` : ""}
                {c.codigoPostal ? ` (CP ${c.codigoPostal})` : ""}
              </span>
            </p>
            {c.telefono ? (
              <p className="flex items-center gap-2">
                <Phone className="size-4 shrink-0 text-primary/60" />
                <span>{c.telefono}</span>
              </p>
            ) : null}
          </div>

          <Button
            onClick={() => onGenerar(c)}
            className="mt-1 w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Printer className="size-4" />
            Generar etiqueta
          </Button>
        </li>
      ))}
    </ul>
  )
}

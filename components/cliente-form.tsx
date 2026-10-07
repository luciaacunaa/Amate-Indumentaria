"use client"

import { useState, type FormEvent } from "react"
import { Field } from "@/components/field"
import { Button } from "@/components/ui/button"
import { clienteVacio, type ClienteFormValues } from "@/lib/types"

type ClienteFormProps = {
  valorInicial?: ClienteFormValues
  onGuardar: (valores: ClienteFormValues) => void
  onCancelar: () => void
}

const REQUERIDOS: { campo: keyof ClienteFormValues; label: string }[] = [
  { campo: "nombre", label: "Nombre y apellido" },
  { campo: "dni", label: "DNI" },
  { campo: "telefono", label: "Teléfono / WhatsApp" },
  { campo: "calle", label: "Calle" },
  { campo: "numero", label: "Número" },
  { campo: "localidad", label: "Localidad" },
  { campo: "provincia", label: "Provincia" },
  { campo: "codigoPostal", label: "Código postal" },
]

export function ClienteForm({ valorInicial, onGuardar, onCancelar }: ClienteFormProps) {
  const [valores, setValores] = useState<ClienteFormValues>(valorInicial ?? clienteVacio)
  const [error, setError] = useState("")

  const actualizar = (campo: keyof ClienteFormValues) => (e: { target: { value: string } }) =>
    setValores((v) => ({ ...v, [campo]: e.target.value }))

  const enviar = (e: FormEvent) => {
    e.preventDefault()
    const faltantes = REQUERIDOS.filter(({ campo }) => !String(valores[campo] ?? "").trim())
    if (faltantes.length > 0) {
      setError(`Falta completar: ${faltantes.map((f) => f.label).join(", ")}`)
      return
    }
    setError("")
    onGuardar({
      ...valores,
      nombre: valores.nombre.trim(),
    })
  }

  return (
    <form onSubmit={enviar} noValidate className="flex flex-col gap-4">
      <Field
        label="Nombre y apellido"
        name="nombre"
        value={valores.nombre}
        onChange={actualizar("nombre")}
        placeholder="Ej: María González"
        autoFocus
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          label="DNI"
          name="dni"
          value={valores.dni}
          onChange={actualizar("dni")}
          placeholder="Ej: 40123456"
          inputMode="numeric"
        />
        <Field
          label="Teléfono / WhatsApp"
          name="telefono"
          value={valores.telefono}
          onChange={actualizar("telefono")}
          placeholder="Ej: 11 2345 6789"
          inputMode="tel"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto_auto]">
        <Field
          label="Calle"
          name="calle"
          value={valores.calle}
          onChange={actualizar("calle")}
          placeholder="Ej: Av. Siempre Viva"
          className="sm:min-w-0"
        />
        <Field
          label="Número"
          name="numero"
          value={valores.numero}
          onChange={actualizar("numero")}
          placeholder="742"
          className="sm:w-28"
        />
        <Field
          label="Piso / Depto"
          name="pisoDepto"
          value={valores.pisoDepto}
          onChange={actualizar("pisoDepto")}
          placeholder="3° B"
          className="sm:w-28"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field
          label="Localidad"
          name="localidad"
          value={valores.localidad}
          onChange={actualizar("localidad")}
          placeholder="Ej: Lomas de Zamora"
        />
        <Field
          label="Provincia"
          name="provincia"
          value={valores.provincia}
          onChange={actualizar("provincia")}
          placeholder="Ej: Buenos Aires"
        />
        <Field
          label="Código postal"
          name="codigoPostal"
          value={valores.codigoPostal}
          onChange={actualizar("codigoPostal")}
          placeholder="Ej: 1832"
        />
      </div>

      {error && (
        <p role="alert" className="text-sm font-semibold text-destructive">
          {error}
        </p>
      )}

      <div className="mt-1 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onCancelar}>
          Cancelar
        </Button>
        <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
          Guardar clienta
        </Button>
      </div>
    </form>
  )
}
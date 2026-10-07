"use client"

import { useState, type FormEvent } from "react"
import { Field } from "@/components/field"
import { Button } from "@/components/ui/button"
import type { Remitente } from "@/lib/types"

type RemitenteFormProps = {
  valorInicial: Remitente
  onGuardar: (valores: Remitente) => void
  onCancelar: () => void
}

const REQUERIDOS: { campo: keyof Remitente; label: string }[] = [
  { campo: "nombre", label: "Nombre y apellido" },
  { campo: "dni", label: "DNI" },
  { campo: "cuit", label: "CUIT" },
  { campo: "direccion", label: "Dirección" },
  { campo: "codigoPostal", label: "Código postal" },
  { campo: "localidad", label: "Localidad" },
  { campo: "provincia", label: "Provincia" },
  { campo: "telefono", label: "Teléfono" },
  { campo: "subCuenta", label: "Sub-cuenta" },
  { campo: "sucursal", label: "Sucursal / modalidad de entrega" },
]

export function RemitenteForm({ valorInicial, onGuardar, onCancelar }: RemitenteFormProps) {
  const [valores, setValores] = useState<Remitente>(valorInicial)
  const [error, setError] = useState("")

  const actualizar = (campo: keyof Remitente) => (e: { target: { value: string } }) =>
    setValores((v) => ({ ...v, [campo]: e.target.value }))

  const campo = (name: keyof Remitente, label: string, placeholder: string) => (
    <Field
      label={label}
      name={name}
      value={valores[name]}
      onChange={actualizar(name)}
      placeholder={placeholder}
    />
  )

  const enviar = (e: FormEvent) => {
    e.preventDefault()
    const faltantes = REQUERIDOS.filter(({ campo }) => !valores[campo]?.trim())
    if (faltantes.length > 0) {
      setError(`Falta completar: ${faltantes.map((f) => f.label).join(", ")}`)
      return
    }
    setError("")
    onGuardar(valores)
  }

  return (
    <form onSubmit={enviar} noValidate className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        Son tus datos como remitente. Se completan solos en cada etiqueta (Viacargo y Correo
        Argentino).
      </p>

      {campo("nombre", "Nombre y apellido")}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {campo("dni", "DNI", "Ej: 48256720")}
        {campo("cuit", "CUIT", "Ej: 27482567202")}
      </div>

      {campo("direccion", "Dirección", "Ej: Av. Siempre Viva 758")}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {campo("codigoPostal", "Código postal", "Ej: 1849")}
        {campo("localidad", "Localidad", "Ej: Lomas de Zamora")}
        {campo("provincia", "Provincia", "Ej: Buenos Aires")}
      </div>

      <div className="rounded-xl border border-border bg-secondary/40 p-4">
        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-primary">
          Solo para Correo Argentino
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {campo("telefono", "Teléfono", "Ej: 15779410")}
          {campo("subCuenta", "Sub-cuenta", "Ej: 47195")}
        </div>
        <div className="mt-4">
          {campo("sucursal", "Sucursal / modalidad de entrega", "Ej: Sucursal")}
        </div>
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
          Guardar remitente
        </Button>
      </div>
    </form>
  )
}
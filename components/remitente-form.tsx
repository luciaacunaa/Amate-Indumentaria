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

export function RemitenteForm({ valorInicial, onGuardar, onCancelar }: RemitenteFormProps) {
  const [valores, setValores] = useState<Remitente>(valorInicial)

  const actualizar = (campo: keyof Remitente) => (e: { target: { value: string } }) =>
    setValores((v) => ({ ...v, [campo]: e.target.value }))

  const enviar = (e: FormEvent) => {
    e.preventDefault()
    onGuardar(valores)
  }

  return (
    <form onSubmit={enviar} className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        Son tus datos como remitente. Se completan solos en cada etiqueta (Viacargo y Correo
        Argentino).
      </p>

      <Field
        label="Nombre y apellido"
        name="nombre"
        value={valores.nombre}
        onChange={actualizar("nombre")}
        placeholder="Ej: Velázquez Priscila"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          label="DNI"
          name="dni"
          value={valores.dni}
          onChange={actualizar("dni")}
          placeholder="Ej: 42.238.738"
        />
        <Field
          label="CUIT"
          name="cuit"
          value={valores.cuit}
          onChange={actualizar("cuit")}
          placeholder="Ej: 27422387388"
        />
      </div>

      <Field
        label="Dirección"
        name="direccion"
        value={valores.direccion}
        onChange={actualizar("direccion")}
        placeholder="Ej: Madreselva 645"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field
          label="Código postal"
          name="codigoPostal"
          value={valores.codigoPostal}
          onChange={actualizar("codigoPostal")}
          placeholder="Ej: 1771"
        />
        <Field
          label="Localidad"
          name="localidad"
          value={valores.localidad}
          onChange={actualizar("localidad")}
          placeholder="Ej: Mercado Central"
        />
        <Field
          label="Provincia"
          name="provincia"
          value={valores.provincia}
          onChange={actualizar("provincia")}
          placeholder="Ej: Bs As"
        />
      </div>

      <div className="rounded-xl border border-border bg-secondary/40 p-4">
        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-primary">
          Solo para Correo Argentino
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field
            label="Teléfono"
            name="telefono"
            value={valores.telefono}
            onChange={actualizar("telefono")}
            placeholder="Ej: 1134212331"
          />
          <Field
            label="Sub-cuenta"
            name="subCuenta"
            value={valores.subCuenta}
            onChange={actualizar("subCuenta")}
            placeholder="Ej: 43125"
          />
        </div>
        <div className="mt-4">
          <Field
            label="Sucursal / modalidad de entrega"
            name="sucursal"
            value={valores.sucursal}
            onChange={actualizar("sucursal")}
            placeholder="Ej: Sucursal"
          />
        </div>
      </div>

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

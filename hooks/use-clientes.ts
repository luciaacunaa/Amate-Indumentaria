"use client"

import { useCallback, useEffect, useState } from "react"
import type { Cliente, ClienteFormValues, Remitente } from "@/lib/types"
import { remitentePorDefecto } from "@/lib/types"

const CLIENTES_KEY = "amate:clientes"
const REMITENTE_KEY = "amate:remitente"
const PEDIDO_KEY = "amate:proximo-pedido"

function generarId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function leer<T>(clave: string, porDefecto: T): T {
  if (typeof window === "undefined") return porDefecto
  try {
    const crudo = window.localStorage.getItem(clave)
    return crudo ? (JSON.parse(crudo) as T) : porDefecto
  } catch {
    return porDefecto
  }
}

export function useClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [remitente, setRemitenteState] = useState<Remitente>(remitentePorDefecto)
  const [proximoPedido, setProximoPedido] = useState<number>(1)
  const [cargado, setCargado] = useState(false)

  useEffect(() => {
    setClientes(leer<Cliente[]>(CLIENTES_KEY, []))
    setRemitenteState(leer<Remitente>(REMITENTE_KEY, remitentePorDefecto))
    setProximoPedido(leer<number>(PEDIDO_KEY, 1))
    setCargado(true)
  }, [])

  const persistirClientes = useCallback((siguiente: Cliente[]) => {
    setClientes(siguiente)
    window.localStorage.setItem(CLIENTES_KEY, JSON.stringify(siguiente))
  }, [])

  const agregarCliente = useCallback(
    (valores: ClienteFormValues) => {
      const nuevo: Cliente = { ...valores, id: generarId(), creadaEn: Date.now() }
      persistirClientes([nuevo, ...clientes])
      return nuevo
    },
    [clientes, persistirClientes],
  )

  const editarCliente = useCallback(
    (id: string, valores: ClienteFormValues) => {
      persistirClientes(clientes.map((c) => (c.id === id ? { ...c, ...valores } : c)))
    },
    [clientes, persistirClientes],
  )

  const eliminarCliente = useCallback(
    (id: string) => {
      persistirClientes(clientes.filter((c) => c.id !== id))
    },
    [clientes, persistirClientes],
  )

  const guardarRemitente = useCallback((valores: Remitente) => {
    setRemitenteState(valores)
    window.localStorage.setItem(REMITENTE_KEY, JSON.stringify(valores))
  }, [])

  const consumirNroPedido = useCallback(() => {
    const actual = proximoPedido
    const siguiente = actual + 1
    setProximoPedido(siguiente)
    window.localStorage.setItem(PEDIDO_KEY, JSON.stringify(siguiente))
    return actual
  }, [proximoPedido])

  return {
    clientes,
    remitente,
    proximoPedido,
    cargado,
    agregarCliente,
    editarCliente,
    eliminarCliente,
    guardarRemitente,
    consumirNroPedido,
  }
}

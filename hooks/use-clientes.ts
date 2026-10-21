"use client"

import { useCallback, useEffect, useState } from "react"
import type { Cliente, ClienteFormValues, Remitente } from "@/lib/types"
import { remitentePorDefecto } from "@/lib/types"

declare global {
  interface Window {
    api: {
      listarClientas: () => Promise<Cliente[]>
      buscarClientas: (texto: string) => Promise<Cliente[]>
      crearClienta: (d: ClienteFormValues) => Promise<Cliente>
      editarClienta: (id: string, d: ClienteFormValues) => Promise<void>
      eliminarClienta: (id: string) => Promise<void>
      obtenerRemitente: () => Promise<Remitente | null>
      guardarRemitente: (r: Remitente) => Promise<void>
      obtenerPedido: () => Promise<number>
      consumirPedido: () => Promise<number>
      imprimirEtiqueta: () => Promise<{ exito: boolean; motivo: string }>
      guardarEtiquetaPdf: (nombre: string) => Promise<string | null>
    }
  }
}

export function useClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [remitente, setRemitenteState] = useState<Remitente>(remitentePorDefecto)
  const [proximoPedido, setProximoPedido] = useState<number>(1)
  const [cargado, setCargado] = useState(false)

  const recargar = useCallback(async () => {
    setClientes(await window.api.listarClientas())
  }, [])

  useEffect(() => {
    async function iniciar() {
      const [lista, rem, pedido] = await Promise.all([
        window.api.listarClientas(),
        window.api.obtenerRemitente(),
        window.api.obtenerPedido(),
      ])
      setClientes(lista)
      setRemitenteState({ ...remitentePorDefecto, ...(rem ?? {}) })
      setProximoPedido(pedido)
      setCargado(true)
    }
    iniciar()
  }, [])

  const agregarCliente = useCallback(
    async (valores: ClienteFormValues) => {
      try {
        await window.api.crearClienta(valores)
        await recargar()
      } catch (err) {
        window.alert((err as Error).message)
      }
    },
    [recargar],
  )

  const editarCliente = useCallback(
    async (id: string, valores: ClienteFormValues) => {
      try {
        await window.api.editarClienta(id, valores)
        await recargar()
      } catch (err) {
        window.alert((err as Error).message)
      }
    },
    [recargar],
  )

  const eliminarCliente = useCallback(
    async (id: string) => {
      await window.api.eliminarClienta(id)
      await recargar()
    },
    [recargar],
  )

  const guardarRemitente = useCallback(async (valores: Remitente) => {
    await window.api.guardarRemitente(valores)
    setRemitenteState(valores)
  }, [])

  const consumirNroPedido = useCallback(async () => {
    const usado = await window.api.consumirPedido()
    setProximoPedido(usado + 1)
    return usado
  }, [])

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
import { useEffect, useState } from 'react'
import { socketClient } from '@/lib/socket'

interface CourierLocation {
  lat: number
  lng: number
}

interface OrderUpdate {
  orderId: string
  status: string
  updatedAt: string
}

export function useOrderTracking(orderId: string | null | undefined) {
  const [isConnected, setIsConnected] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<OrderUpdate | null>(null)
  const [courierLocation, setCourierLocation] = useState<CourierLocation | null>(null)

  useEffect(() => {
    if (!orderId) return

    // Connect socket
    const socket = socketClient.connect()
    setIsConnected(socket.connected)

    // Join order room
    socketClient.joinOrder(orderId)

    // Listen for updates
    const handleOrderUpdate = (data: OrderUpdate) => {
      console.log('📦 Order update:', data)
      setLastUpdate(data)
    }

    const handleCourierLocation = (data: CourierLocation) => {
      console.log('📍 Courier location:', data)
      setCourierLocation(data)
    }

    socketClient.onOrderUpdate(handleOrderUpdate)
    socketClient.onCourierLocation(handleCourierLocation)

    // Cleanup
    return () => {
      socketClient.leaveOrder(orderId)
      socketClient.offOrderUpdate(handleOrderUpdate)
      socketClient.offCourierLocation(handleCourierLocation)
    }
  }, [orderId])

  return {
    isConnected,
    lastUpdate,
    courierLocation,
  }
}

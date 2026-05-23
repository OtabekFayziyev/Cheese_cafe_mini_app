import { io, Socket } from 'socket.io-client'

// Vercel deployment: use Railway backend URL
// Local development: use same origin
const SOCKET_URL = import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL.replace('/api', '') // Remove /api suffix
  : window.location.origin

class SocketClient {
  private socket: Socket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5

  connect() {
    if (this.socket?.connected) return this.socket

    this.socket = io(SOCKET_URL, {
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: this.maxReconnectAttempts,
    })

    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket?.id)
      this.reconnectAttempts = 0
    })

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason)
    })

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error)
      this.reconnectAttempts++
    })

    return this.socket
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  getSocket() {
    if (!this.socket || !this.socket.connected) {
      return this.connect()
    }
    return this.socket
  }

  // Order tracking
  joinOrder(orderId: string) {
    this.getSocket().emit('join-order', orderId)
  }

  leaveOrder(orderId: string) {
    this.getSocket().emit('leave-order', orderId)
  }

  onOrderUpdate(callback: (data: any) => void) {
    this.getSocket().on('order-update', callback)
  }

  offOrderUpdate(callback: (data: any) => void) {
    this.getSocket().off('order-update', callback)
  }

  // Courier tracking
  joinCourier(courierId: string) {
    this.getSocket().emit('join-courier', courierId)
  }

  leaveCourier(courierId: string) {
    this.getSocket().emit('leave-courier', courierId)
  }

  onCourierLocation(callback: (data: { lat: number; lng: number }) => void) {
    this.getSocket().on('courier-location', callback)
  }

  offCourierLocation(callback: (data: { lat: number; lng: number }) => void) {
    this.getSocket().off('courier-location', callback)
  }
}

export const socketClient = new SocketClient()
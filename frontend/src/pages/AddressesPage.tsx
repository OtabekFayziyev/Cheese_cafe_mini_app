import { useState, useEffect } from 'react'
import { MapPin, Plus, Edit2, Trash2, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Sheet } from '@/components/ui/Sheet'
import { useBackButton } from '@/hooks/useBackButton'
import { useAddresses, useCreateAddress, useUpdateAddress, useDeleteAddress } from '@/hooks/useAddresses'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { haptic } from '@/lib/telegram'
import type { DeliveryAddress } from '@/types/order'

export function AddressesPage() {
  const navigate = useNavigate()
  const { data: addresses = [], isLoading } = useAddresses()
  const createAddress = useCreateAddress()
  const updateAddress = useUpdateAddress()
  const deleteAddress = useDeleteAddress()

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<any | null>(null)
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)

  useBackButton(() => navigate(-1))

  const handleAddAddress = async (addressData: DeliveryAddress) => {
    if (editingAddress) {
      await updateAddress.mutateAsync({ id: editingAddress.id, data: addressData })
      setEditingAddress(null)
    } else {
      await createAddress.mutateAsync(addressData)
    }
    setIsAddModalOpen(false)
  }

  const handleDelete = async (id: string) => {
    haptic.notification('warning')
    await deleteAddress.mutateAsync(id)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-6xl">🧀</div>
          <div className="text-tg-body font-semibold">Yuklanmoqda...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-brand-cream/95 px-5 py-4 backdrop-blur-md">
        <h1 className="text-tg-headline font-extrabold">📍 Manzillarim</h1>
      </div>

      {/* Empty state */}
      {addresses.length === 0 && (
        <div className="mt-20 flex flex-col items-center px-8 text-center">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-brand-cream-muted">
            <MapPin className="h-12 w-12 text-brand-dark/30" />
          </div>
          <h2 className="mb-3 font-display text-2xl font-black">Manzil yo'q</h2>
          <p className="mb-6 max-w-xs text-tg-body leading-relaxed text-brand-dark/60">
            Yetkazib berish uchun manzil qo'shing. Xaritadan aniq joylashuvni belgilang.
          </p>
          <Button
            onClick={() => {
              haptic.impact('medium')
              setIsAddModalOpen(true)
            }}
            variant="secondary"
          >
            <Plus className="h-5 w-5" />
            Manzil qo'shish
          </Button>
        </div>
      )}

      {/* Manzillar ro'yxati */}
      {addresses.length > 0 && (
        <div className="mt-4 px-5">
          <div className="space-y-3">
            <AnimatePresence>
              {addresses.map((address) => {
                const isSelected = address.id === selectedAddressId
                return (
                  <motion.div
                    key={address.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className={cn(
                      'rounded-brand border-2 bg-white p-4 shadow-card transition-all',
                      isSelected
                        ? 'border-brand-yellow'
                        : 'border-transparent'
                    )}
                  >
                    <div className="mb-2 flex items-start justify-between">
                      <div className="flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-brand-red" />
                          <span className="font-bold">{address.fullAddress}</span>
                        </div>
                        {address.apartment && (
                          <p className="text-tg-caption text-brand-dark/60">
                            Xona: {address.apartment}
                            {address.floor && `, ${address.floor}-qavat`}
                            {address.entrance && `, ${address.entrance}-kirish`}
                          </p>
                        )}
                        {address.comment && (
                          <p className="mt-1 text-xxs italic text-brand-dark/50">
                            💬 {address.comment}
                          </p>
                        )}
                      </div>

                      {isSelected && (
                        <div className="flex-shrink-0 rounded-lg bg-brand-yellow p-1.5">
                          <Check className="h-4 w-4 text-brand-dark" strokeWidth={3} />
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={isSelected ? 'outline' : 'secondary'}
                        fullWidth
                        onClick={() => {
                          haptic.selection()
                          setSelectedAddressId(address.id)
                        }}
                      >
                        {isSelected ? '✓ Tanlangan' : 'Tanlash'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingAddress(address)
                          setIsAddModalOpen(true)
                        }}
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(address.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>

          <Button
            onClick={() => {
              haptic.impact('medium')
              setIsAddModalOpen(true)
            }}
            variant="outline"
            fullWidth
            className="mt-4"
          >
            <Plus className="h-5 w-5" />
            Yangi manzil qo'shish
          </Button>
        </div>
      )}

      {/* Add/Edit modal */}
      <AddressFormModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false)
          setEditingAddress(null)
        }}
        onSave={handleAddAddress}
        initialAddress={editingAddress}
      />
    </div>
  )
}

interface AddressFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (address: DeliveryAddress) => void
  initialAddress?: DeliveryAddress
}

function AddressFormModal({ isOpen, onClose, onSave, initialAddress }: AddressFormModalProps) {
  const [fullAddress, setFullAddress] = useState('')
  const [apartment, setApartment] = useState('')
  const [floor, setFloor] = useState('')
  const [entrance, setEntrance] = useState('')
  const [intercom, setIntercom] = useState('')
  const [comment, setComment] = useState('')

  // initialAddress o'zgarganda formni yangilash
  useEffect(() => {
    if (initialAddress) {
      setFullAddress(initialAddress.fullAddress ?? '')
      setApartment(initialAddress.apartment ?? '')
      setFloor(initialAddress.floor ?? '')
      setEntrance(initialAddress.entrance ?? '')
      setIntercom(initialAddress.intercom ?? '')
      setComment(initialAddress.comment ?? '')
    } else {
      // Yangi manzil qo'shish — formni tozalash
      setFullAddress('')
      setApartment('')
      setFloor('')
      setEntrance('')
      setIntercom('')
      setComment('')
    }
  }, [initialAddress, isOpen])
  const [showMap, setShowMap] = useState(false)

  const handleSave = () => {
    if (!fullAddress.trim()) {
      useUIStore.getState().showToast('Manzil kiriting', 'error')
      return
    }

    onSave({
      fullAddress: fullAddress.trim(),
      apartment: apartment.trim() || undefined,
      floor: floor.trim() || undefined,
      entrance: entrance.trim() || undefined,
      intercom: intercom.trim() || undefined,
      comment: comment.trim() || undefined,
    })
  }

  return (
    <Sheet
      open={isOpen}
      onOpenChange={onClose}
      title={initialAddress ? 'Manzilni tahrirlash' : 'Yangi manzil'}
    >
      <div className="space-y-4">
        {/* Xarita (placeholder) */}
        <div className="relative h-48 overflow-hidden rounded-brand bg-gradient-to-br from-green-100 to-emerald-200">
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <MapPin className="mb-2 h-8 w-8 text-brand-red" />
            <p className="text-tg-caption font-bold">Xarita integratsiyasi</p>
            <p className="mt-1 text-xxs text-brand-dark/60">
              Yandex Maps API (keyingi yangilanishda)
            </p>
          </div>
        </div>

        <Input
          label="To'liq manzil"
          value={fullAddress}
          onChange={(e) => setFullAddress(e.target.value)}
          placeholder="Ko'cha, uy raqami, mo'ljal..."
        />

        <div className="grid grid-cols-2 gap-2">
          <Input
            label="Xona/kvartira"
            value={apartment}
            onChange={(e) => setApartment(e.target.value)}
            placeholder="12"
          />
          <Input
            label="Qavat"
            value={floor}
            onChange={(e) => setFloor(e.target.value)}
            placeholder="3"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Input
            label="Kirish"
            value={entrance}
            onChange={(e) => setEntrance(e.target.value)}
            placeholder="A"
          />
          <Input
            label="Domofon"
            value={intercom}
            onChange={(e) => setIntercom(e.target.value)}
            placeholder="*123"
          />
        </div>

        <Input
          label="Qo'shimcha (ixtiyoriy)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Masalan: qora darvoza, ikkinchi bino"
        />

        <Button onClick={handleSave} fullWidth>
          {initialAddress ? 'Saqlash' : 'Qo\'shish'}
        </Button>
      </div>
    </Sheet>
  )
}

'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Image, Video } from 'lucide-react'

interface LightboxProps {
  items: Array<{
    id: string
    filePath: string
    type: string
    description?: string | null
    cat?: { name: string } | null
  }>
  currentIndex: number
  onClose: () => void
  onNavigate: (index: number) => void
}

export function Lightbox({ items, currentIndex, onClose, onNavigate }: LightboxProps) {
  const currentItem = items[currentIndex]

  const handlePrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1
    onNavigate(newIndex)
  }

  const handleNext = () => {
    const newIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0
    onNavigate(newIndex)
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
        onClick={onClose}
      >
        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-white/70 hover:text-white z-10"
          onClick={onClose}
        >
          <X className="w-8 h-8" />
        </button>

        {/* Navigation */}
        <button
          className="absolute left-4 text-white/70 hover:text-white z-10 p-2"
          onClick={(e) => {
            e.stopPropagation()
            handlePrevious()
          }}
        >
          <ChevronLeft className="w-10 h-10" />
        </button>

        <button
          className="absolute right-4 text-white/70 hover:text-white z-10 p-2"
          onClick={(e) => {
            e.stopPropagation()
            handleNext()
          }}
        >
          <ChevronRight className="w-10 h-10" />
        </button>

        {/* Content */}
        <motion.div
          key={currentItem.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="max-w-5xl max-h-[80vh] mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          {currentItem.type === 'video' ? (
            <video
              src={currentItem.filePath}
              controls
              className="max-w-full max-h-[70vh] mx-auto"
            />
          ) : (
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-8 flex items-center justify-center min-h-[400px]">
              <Image className="w-24 h-24 text-gray-600" />
            </div>
          )}

          {/* Info */}
          <div className="text-center mt-4 text-white">
            {currentItem.cat && (
              <p className="text-sm text-white/60 mb-1">{currentItem.cat.name}</p>
            )}
            {currentItem.description && (
              <p className="text-white/80">{currentItem.description}</p>
            )}
            <p className="text-sm text-white/40 mt-2">
              {currentIndex + 1} / {items.length}
            </p>
          </div>
        </motion.div>

        {/* Thumbnail strip */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 overflow-x-auto max-w-[80vw] pb-2">
          {items.map((item, index) => (
            <button
              key={item.id}
              className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-colors ${
                index === currentIndex
                  ? 'border-white'
                  : 'border-transparent opacity-50 hover:opacity-100'
              }`}
              onClick={(e) => {
                e.stopPropagation()
                onNavigate(index)
              }}
            >
              <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                {item.type === 'video' ? (
                  <Video className="w-4 h-4 text-gray-400" />
                ) : (
                  <Image className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </button>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

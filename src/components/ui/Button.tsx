'use client'

import { useRouter } from 'next/navigation'
import { Play, Plus, Info, Check } from 'lucide-react'
import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { ADD_TO_LIST } from '@/lib/apollo/queries'
import { FaInfoCircle } from 'react-icons/fa'

export function PlayButton() {
  const router = useRouter()

  return (
    <button
      onClick={() => router.push('/watch')}
      className="flex items-center bg-white text-black px-6 py-2 rounded hover:bg-opacity-80 transition"
    >
      <Play className="mr-2 h-5 w-5 fill-current" />
      Play
    </button>
  )
}

interface AddToListButtonProps {
  mediaId: string
}

export function AddToListButton({ mediaId }: AddToListButtonProps) {
  const [isAdded, setIsAdded] = useState(false)
  const [addToList] = useMutation(ADD_TO_LIST)

  const handleClick = async () => {
    try {
      await addToList({ variables: { mediaId } })
      setIsAdded(true)
      setTimeout(() => setIsAdded(false), 2000)
    } catch (error) {
      console.error('Error adding to list:', error)
    }
  }

  return (
    <button
      onClick={handleClick}
      className="flex items-center bg-gray-600 bg-opacity-70 text-white px-6 py-2 rounded hover:bg-opacity-50 transition"
    >
      {isAdded ? (
        <Check className="mr-2 h-5 w-5" />
      ) : (
        <Plus className="mr-2 h-5 w-5" />
      )}
      {isAdded ? 'Added!' : 'My List'}
    </button>
  )
}

interface InfoButtonProps {
  mediaId: string
}

export function InfoButton({ mediaId }: InfoButtonProps) {
  const router = useRouter()

  return (
    <button 
      onClick={() => router.push(`/watch/${mediaId}`)}
      className="bg-gray-600 bg-opacity-70 text-white px-6 py-2 rounded flex items-center hover:bg-opacity-50"
    >
      <FaInfoCircle className="mr-2" /> More Info
    </button>
  )
}

export function Button({ children, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`bg-red-600 text-white px-4 py-2 rounded ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
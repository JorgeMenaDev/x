"use client"

// This is a simplified version of the toast component
// In a real application, you would use the full implementation from shadcn/ui

import { createContext, useContext } from "react"

const ToastContext = createContext({})

export function useToast() {
  const context = useContext(ToastContext)

  return {
    toast: ({ title, description, variant }) => {
      console.log({ title, description, variant })
      alert(`${title}: ${description}`)
    },
  }
}

export { useToast as toast }


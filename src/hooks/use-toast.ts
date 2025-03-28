// use-toast.ts
import { toast } from 'react-hot-toast'

type ToastInput = {
  title: string
  description?: string
  type?: 'success' | 'error' | 'info' | 'loading'
  duration?: number
}

export const useToast = () => {
  const show = ({ title, description, type = 'info', duration }: ToastInput) => {
    const message = description ? `${title} — ${description}` : title
    switch (type) {
      case 'success':
        toast.success(message, { duration })
        break
      case 'error':
        toast.error(message, { duration })
        break
      case 'loading':
        toast.loading(message, { duration })
        break
      default:
        toast(message, { duration })
    }
  }

  return show
}
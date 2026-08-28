import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const min = Math.round(diff / 60000)
  if (min < 1) return 'agora'
  if (min < 60) return `há ${min} min`
  const hours = Math.round(min / 60)
  if (hours < 24) return `há ${hours} h`
  const days = Math.round(hours / 24)
  if (days < 30) return `há ${days} d`
  return formatDate(iso)
}

export function daysUntil(iso: string) {
  const diff = new Date(iso).getTime() - Date.now()
  return Math.ceil(diff / 86400000)
}

export function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

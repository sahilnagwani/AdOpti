import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats numbers into Indian currency style (₹)
 * with auto-conversion to Lakh (L) and Crore (Cr)
 */
export function formatINR(value: number, compact = true) {
  if (compact) {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(2)}Cr`
    }
    if (value >= 100000) {
      return `₹${(value / 100000).toFixed(2)}L`
    }
  }
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value)
}

export function formatCompactNumber(value: number) {
  if (value >= 10000000) return `${(value / 10000000).toFixed(1)}Cr`
  if (value >= 100000) return `${(value / 100000).toFixed(1)}L`
  return value.toLocaleString('en-IN')
}

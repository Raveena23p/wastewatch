import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { XataClient } from '@/xata'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const convertTimeToString = (counter: number) => {
  let time = String(Math.floor(counter / 60)).padStart(2, '0') + ':' + String(Math.floor(counter % 60)).padStart(2, '0')
  return time
}

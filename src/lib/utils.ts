import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const convertTimeToString = (counter: number) => {

	let time = String(Math.floor(counter / 60)).padStart(2, '0') + ':' + String(Math.floor(counter % 60)).padStart(2, '0')
	return time
}


export const convertMSTimeToString = (ms: number) => {

	const minutes = String(Math.floor( ms / 100 / 60)).padStart(2, '0')
	const seconds = String(Math.floor( (ms / 100) % 60 )).padStart(2, '0')
	const milliseconds = String(Math.floor(ms % 100)).padStart(2, '0')

	const timerString = `${minutes}:${seconds}:${milliseconds}`

	return {
		minutes,
		seconds,
		milliseconds,
		timerString
	}
}

export const getGuestUsername = () => {
	let guessUsername = window.localStorage.getItem('guestUsername')

	if (!guessUsername) {
		guessUsername = generateGuestUsername()
		window.localStorage.setItem('guestUsername', guessUsername)
	}
	
	return guessUsername
}

export const generateGuestUsername = () => {
	return  `GuestUser${Math.floor(Math.random() * 100000)}`
}

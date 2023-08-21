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

	let timeInMs = ms ? ms : 0

	const minutes = String(Math.floor( timeInMs / 100 / 60)).padStart(2, '0')
	const seconds = String(Math.floor( (timeInMs / 100) % 60 )).padStart(2, '0')
	const milliseconds = String(Math.floor(timeInMs % 100)).padStart(2, '0')

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

export const rankToText = (rank: number): string => {
    
	let by10 = Math.floor((rank + 1) / 10)
    let ranking = (rank + 1) % 10
    if ( by10 !== 1 && ranking === 1 ) return `${ranking}st`
    if ( by10 !== 1 && ranking === 2 ) return `${ranking}nd`
    if ( by10 !== 1 && ranking === 3 ) return `${ranking}rd`

    return by10 > 0 ? `${by10}${ranking}th` :  `${ranking}th`
}



import { Auth } from 'aws-amplify';

// To get the current authenticated user
export const getCurrentUser = async () => {
  try {
    const user = await Auth.currentAuthenticatedUser();
    return user;
  } catch (error) {
    return null;
  }
}
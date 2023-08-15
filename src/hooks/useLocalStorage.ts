import { useState, useEffect } from 'react';

const useLocalStorage = (key: string, initialValue: string) => {
	const [value, setValue] = useState(() => {
		// Get stored value from local storage or use initial value
		const storedValue = typeof window !== 'undefined' ? localStorage.getItem(key): null
		return storedValue ? JSON.parse(storedValue) : initialValue;
	});

	useEffect(() => {
		// Update local storage when the value changes
		window.localStorage.setItem(key, JSON.stringify(value))

	}, [key, value]);

	return [value, setValue];
};

export default useLocalStorage;

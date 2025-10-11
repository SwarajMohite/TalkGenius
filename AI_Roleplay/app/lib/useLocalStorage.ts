'use client';
import { useState } from 'react';


export function useLocalStorage<T>(key: string, initialValue: T) {
const [storedValue, setStoredValue] = useState<T>(() => {
try {
if (typeof window === 'undefined') return initialValue;
const item = window.localStorage.getItem(key);
return item ? (JSON.parse(item) as T) : initialValue;
} catch (e) {
console.error(e);
return initialValue;
}
});


const setValue = (value: T) => {
try {
setStoredValue(value);
if (typeof window !== 'undefined') {
window.localStorage.setItem(key, JSON.stringify(value));
}
} catch (e) {
console.error(e);
}
};


return [storedValue, setValue] as const;
}
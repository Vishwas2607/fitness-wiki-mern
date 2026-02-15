import { useState } from "react";

export default function useLocalStorage<T>(key: string, initialValue: T): [T, (value:T)=> void] {
    const [storedData, setStoredData] = useState<T>(()=> {
        try{
            const savedData = localStorage.getItem(key);
            return savedData ? JSON.parse(savedData) : initialValue;
        } catch (err) {
            console.error(err);
            return initialValue;
        }
    });

    const setSavedValue = (value: T) => {
        localStorage.setItem(key, JSON.stringify(value));
        setStoredData(value);
    }

    return [storedData, setSavedValue];
}
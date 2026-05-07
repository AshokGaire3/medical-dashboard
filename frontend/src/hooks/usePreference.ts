import { useCallback, useEffect, useState } from 'react';

export function usePreference<T extends string>(
 key: string,
 defaultValue: T,
): [T, (_value: T) => void] {
 const storageKey = `meddash.pref.${key}`;

 const [value, setValue] = useState<T>(() => {
 if (typeof window === 'undefined') return defaultValue;
 try {
 const raw = localStorage.getItem(storageKey);
 return (raw as T) ?? defaultValue;
 } catch {
 return defaultValue;
 }
 });

 useEffect(() => {
 try {
 localStorage.setItem(storageKey, value);
 } catch {
 /* ignore quota errors */
 }
 }, [storageKey, value]);

 const set = useCallback((v: T) => setValue(v), []);
 return [value, set];
}

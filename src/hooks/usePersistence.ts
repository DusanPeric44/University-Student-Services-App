
import { useState, useEffect } from 'react';
import { storage } from '../lib/storage';

export function usePersistence<T>(key: string, initialValue: T) {
  // Get initial value from storage or use provided initialValue
  const [data, setData] = useState<T>(() => {
    return storage.get<T>(key, initialValue);
  });

  // Sync state with storage whenever data changes
  useEffect(() => {
    storage.set(key, data);
  }, [key, data]);

  // Handle reset
  const reset = () => {
    setData(initialValue);
    storage.set(key, initialValue);
  };

  return [data, setData, reset] as const;
}

import { useEffect, useRef } from 'react';

// Returns the previous value of the given value.

export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);

  // Store current value in ref after render
  useEffect(() => {
    ref.current = value;
  }, [value]);

  // Return the value from the previous render
  return ref.current;
}
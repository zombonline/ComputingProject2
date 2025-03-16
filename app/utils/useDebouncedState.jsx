import { useState, useEffect } from "react";

const useDebouncedState = (initialValue, delay, callback) => {
  const [value, setValue] = useState(initialValue);
  const [debouncedValue, setDebouncedValue] = useState(initialValue);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  useEffect(() => {
    if (debouncedValue) {
      callback(debouncedValue);
    }
  }, [debouncedValue]);

  return [value, setValue];
};

export default useDebouncedState;
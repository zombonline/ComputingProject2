import { useState, useEffect } from "react";

/**
 * Custom hook to manage a debounced state.
 * It delays the update of the state until after a specified delay.
 * This is useful for optimizing performance in scenarios like input fields.
 * @param {any} initialValue - The initial value of the state.
 * @param {number} delay - The delay in milliseconds before updating the state.
 * @param {function} callback - A callback function to be called after the debounced value changes.
 * @returns {[any, function]} - Returns the current state and a function to update it.
 */
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

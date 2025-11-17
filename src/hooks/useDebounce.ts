import { useMemo, useState } from "react"

export function useDebounce<T>(value: T, delay = 400) {
    const [debounced, setDebounced] = useState(value);

    useMemo(() => {
        const handler = setTimeout(() => {
            setDebounced(value);
        }, delay);

        return () => clearTimeout(handler);
    }, [value, delay]);

    return debounced;
};
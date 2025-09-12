import { useRef, useEffect } from "react";

export const useOutsideClick = (
    callback: () => void
) => {
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        function handleClick(event: MouseEvent) {
            if (
                ref.current &&
                !(ref.current as HTMLElement).contains(event.target as Node)
            ) {
                callback();
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => {
            document.removeEventListener("mousedown", handleClick);
        };
    }, [callback]);

    return ref;
};

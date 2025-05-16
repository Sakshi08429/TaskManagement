import React, { useEffect } from "react";

interface DetectOutsideProps {
  ref: React.RefObject<HTMLElement | null>; // Allow null here
  callback: () => void;
}

function useDetectOutside({ ref, callback }: DetectOutsideProps) {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);

  return ref;
}

export default useDetectOutside;

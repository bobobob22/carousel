import React, { useState, useEffect } from "react";

export const useElementWidth = (myRef: React.RefObject<HTMLDivElement>) => {
  const [dimensions, setDimensions] = useState({ width: 0 });

  useEffect(() => {
    const getDimensions = () => ({
      width: myRef?.current?.offsetWidth || 0,
    });

    const handleResize = () => {
      setDimensions(getDimensions());
    };

    if (myRef.current) {
      setDimensions(getDimensions());
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [myRef]);

  return dimensions;
};

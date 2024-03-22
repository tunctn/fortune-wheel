"use client";

import { ReactNode, useMemo } from "react";

export const ViewportContent = ({ children }: { children: ReactNode }) => {
  const viewportContent = useMemo(() => {
    // Detect the device OS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    // Set viewport properties based on the device OS
    const viewportContent = isIOS
      ? "width=device-width, initial-scale=1, maximum-scale=1"
      : "width=device-width, initial-scale=1, shrink-to-fit=no";

    return viewportContent;
  }, []);

  return (
    <>
      <meta name="viewport" content={viewportContent} />
      {children}
    </>
  );
};

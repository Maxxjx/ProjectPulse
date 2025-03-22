"use client";

import React, { forwardRef } from "react";

export interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>((props, ref) => {
  const { children, className, ...rest } = props;
  return (
    <div
      ref={ref}
      className={`overflow-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 ${className || ""}`}
      {...rest}
    >
      {children}
    </div>
  );
});

ScrollArea.displayName = "ScrollArea";

export default ScrollArea;

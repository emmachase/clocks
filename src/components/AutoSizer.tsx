import React, { useRef, useState, useEffect } from 'react';

interface Size {
  width: number;
  height: number;
}

interface AutoSizerProps {
  /**
   * Function that renders the children with width and height
   */
  children: (size: Size) => React.ReactNode;
  /**
   * Default width to use before measurements are available
   */
  defaultWidth?: number;
  /**
   * Default height to use before measurements are available
   */
  defaultHeight?: number;
  /**
   * Optional className for the container div
   */
  className?: string;
  /**
   * Optional style for the container div
   */
  style?: React.CSSProperties;
}

/**
 * A component that automatically measures its dimensions and passes them to its children
 */
export default function AutoSizer({
  children,
  defaultWidth = 0,
  defaultHeight = 0,
  className = '',
  style = {},
}: AutoSizerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<Size>({
    width: defaultWidth,
    height: defaultHeight,
  });

  useEffect(() => {
    if (!containerRef.current) return;

    const updateSize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setSize({ width, height });
      }
    };

    // Initial measurement
    updateSize();

    // Set up ResizeObserver to track size changes
    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(containerRef.current);

    // Clean up
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        width: '100%',
        height: '100%',
        ...style,
      }}
    >
      {children(size)}
    </div>
  );
} 
import React from 'react';
import AutoSizer from './AutoSizer';

export interface WithAutoSizerProps {
  width: number;
  height: number;
}

/**
 * Higher-Order Component that wraps a component with AutoSizer
 * and passes width and height as props
 */
export default function withAutoSizer<P extends WithAutoSizerProps>(
  Component: React.ComponentType<P>
) {
  // Return a new component that wraps the provided component
  return function WithAutoSizer(props: Omit<P, keyof WithAutoSizerProps> & {
    defaultWidth?: number;
    defaultHeight?: number;
    className?: string;
    style?: React.CSSProperties;
  }) {
    const { defaultWidth, defaultHeight, className, style, ...rest } = props;

    return (
      <AutoSizer
        defaultWidth={defaultWidth}
        defaultHeight={defaultHeight}
        className={className}
        style={style}
      >
        {({ width, height }) => (
          <Component
            width={width}
            height={height}
            {...(rest as any)}
          />
        )}
      </AutoSizer>
    );
  };
} 
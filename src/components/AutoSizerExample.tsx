import React from 'react';
import AutoSizer from './AutoSizer';
import withAutoSizer, { WithAutoSizerProps } from './withAutoSizer';

/**
 * Example component using the render prop pattern with AutoSizer
 */
export function RenderPropExample() {
  return (
    <div className="border border-gray-300 rounded-md p-4 h-64">
      <h3 className="text-lg font-medium mb-2">AutoSizer Render Prop Example</h3>
      <div className="h-48 bg-secondary/50 rounded-md overflow-hidden">
        <AutoSizer>
          {({ width, height }) => (
            <div className="p-4">
              <p>Container width: {Math.round(width)}px</p>
              <p>Container height: {Math.round(height)}px</p>
            </div>
          )}
        </AutoSizer>
      </div>
    </div>
  );
}

/**
 * Example component that will be wrapped with the HOC
 */
interface SizedComponentProps extends WithAutoSizerProps {
  label?: string;
}

function SizedComponent({ width, height, label = 'HOC Example' }: SizedComponentProps) {
  return (
    <div className="p-4">
      <p>{label}</p>
      <p>Container width: {Math.round(width)}px</p>
      <p>Container height: {Math.round(height)}px</p>
    </div>
  );
}

/**
 * Create the HOC-wrapped version of the component
 */
const AutoSizedComponent = withAutoSizer(SizedComponent);

/**
 * Example component using the HOC pattern
 */
export function HOCExample() {
  return (
    <div className="border border-gray-300 rounded-md p-4 h-64">
      <h3 className="text-lg font-medium mb-2">AutoSizer HOC Example</h3>
      <div className="h-48 bg-primary/20 rounded-md overflow-hidden">
        <AutoSizedComponent label="HOC Example" />
      </div>
    </div>
  );
}

/**
 * Combined example showing both patterns
 */
export default function AutoSizerExample() {
  return (
    <div className="space-y-8">
      <RenderPropExample />
      <HOCExample />
    </div>
  );
} 
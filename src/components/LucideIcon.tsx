import React from 'react';
import * as Icons from 'lucide-react';

interface LucideIconProps extends React.ComponentPropsWithoutRef<'svg'> {
  name: string;
  className?: string; // Standard className support
  size?: number | string; // Size override
}

export default function LucideIcon({ name, className = '', size, ...props }: LucideIconProps) {
  // Gracefully handle icon lookups. Make sure we match common spellings
  let IconComponent = (Icons as any)[name];

  if (!IconComponent) {
    // Custom mappings for specific keys that might vary
    const mappings: Record<string, string> = {
      'MergeField': 'Merge',
      'AspectRatio': 'Maximize',
      'ReceiptCombined': 'Receipt',
      'WrapText': 'AlignLeft',
      'UserSquare': 'User',
      'TextCursor': 'Type'
    };
    
    const mappedName = mappings[name];
    if (mappedName) {
      IconComponent = (Icons as any)[mappedName];
    }
  }

  // Final fallback to Wrench if still not found
  if (!IconComponent) {
    IconComponent = Icons.Wrench;
  }

  return (
    <IconComponent
      className={className}
      size={size}
      {...props}
    />
  );
}

import React from 'react';
import cn from 'classnames';

import { colors, sizes, Button } from '@stoplight/ui';

const CallToAction = ({
  name,
  color,
  size,
  className,
  href = 'https://next.stoplight.io/join',
}) => {
  if (!name) return null;

  return (
    <div className={cn(className)}>
      <a href="https://next.stoplight.io/join">
        <Button
          color={colors[color] || colors.purple}
          size={sizes[size] || sizes.lg}
          className="rounded-md shadow"
        >
          {name}
        </Button>
      </a>
    </div>
  );
};

export default CallToAction;

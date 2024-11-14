// components/CustomMenuList.tsx
import React from 'react';
import { MenuListProps, components } from 'react-select';

const CustomMenuList = <OptionType, IsMulti extends boolean>(
  props: MenuListProps<OptionType, IsMulti>
) => {
  // Convert children to an array to safely use array methods
  const childrenArray = React.Children.toArray(props.children);

  // Calculate the midpoint to split the array into two columns
  const half = Math.ceil(childrenArray.length / 2);
  const firstColumn = childrenArray.slice(0, half);
  const secondColumn = childrenArray.slice(half);

  return (
    <components.MenuList {...props}>
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1 }}>
          {firstColumn}
        </div>
        <div style={{ flex: 1 }}>
          {secondColumn}
        </div>
      </div>
    </components.MenuList>
  );
};

export default CustomMenuList;

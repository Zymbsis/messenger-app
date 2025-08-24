import clsx from 'clsx';

import type { ComponentPropsWithRef, PropsWithChildren } from 'react';

type Props = PropsWithChildren<
  ComponentPropsWithRef<'input'> & {
    labelStyles?: string;
    inputStyles?: string;
  }
>;

const InputField = ({
  children,
  labelStyles,
  inputStyles,
  ...props
}: Props) => {
  return (
    <label className={clsx('inline-flex flex-col gap-1 w-full', labelStyles)}>
      {children}
      <input
        className={clsx(
          'pl-4 pr-14 border rounded-lg border-black/50 h-12',
          inputStyles,
        )}
        type='text'
        {...props}
      />
    </label>
  );
};

export default InputField;

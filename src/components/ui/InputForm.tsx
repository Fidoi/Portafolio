'use client';
import { Input } from '@heroui/react';

interface Props {
  name: string;
  type: string;
  label: string;
  id: string;
  placeholder: string;
  className: string;
}

export const InputForm = ({
  name,
  type,
  label,
  id,
  placeholder,
  className,
}: Props) => {
  return (
    <Input
      name={name}
      isClearable
      type={type}
      label={label}
      id={id}
      placeholder={placeholder}
      className={className}
    />
  );
};

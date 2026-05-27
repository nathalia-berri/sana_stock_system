import React from "react";

type InputProps = {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
};

export function Input({
  type = "text",
  placeholder = "",
  value,
  onChange,
  className = "",
}: InputProps) {
  const baseStyle =
    "w-full h-10 px-3 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors";

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`${baseStyle} ${className}`}
    />
  );
}

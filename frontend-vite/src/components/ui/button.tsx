import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "default" | "success" | "danger" | "outline";
  className?: string;
};

export function Button({
  children,
  onClick,
  type = "button",
  variant = "default",
  className = "",
}: ButtonProps) {
  const baseStyle =
    "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none";

  let variantStyle = "";
  switch (variant) {
    case "success":
      variantStyle = "bg-green-600 text-white hover:bg-green-700";
      break;
    case "danger":
      variantStyle = "bg-red-600 text-white hover:bg-red-700";
      break;
    case "outline":
      variantStyle = "border border-gray-300 text-gray-700 hover:bg-gray-100";
      break;
    default:
      variantStyle = "bg-blue-600 text-white hover:bg-blue-700";
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyle} ${variantStyle} ${className}`}
    >
      {children}
    </button>
  );
}

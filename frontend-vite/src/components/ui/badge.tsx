import React from "react";

type BadgeProps = {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "outline";
  className?: string;
};

export function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  const baseStyle =
    "inline-flex items-center justify-center rounded-md px-2 py-0.5 text-xs font-medium w-fit";

  let variantStyle = "";
  switch (variant) {
    case "success":
      variantStyle = "bg-green-100 text-green-700 border border-green-200";
      break;
    case "warning":
      variantStyle = "bg-yellow-100 text-yellow-700 border border-yellow-200";
      break;
    case "danger":
      variantStyle = "bg-red-100 text-red-700 border border-red-200";
      break;
    case "outline":
      variantStyle = "border border-gray-300 text-gray-700";
      break;
    default:
      variantStyle = "bg-blue-100 text-blue-700 border border-blue-200";
  }

  return (
    <span className={`${baseStyle} ${variantStyle} ${className}`}>
      {children}
    </span>
  );
}

import React from "react";

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`bg-white border rounded-xl shadow-sm p-6 ${className}`}
    >
      {children}
    </div>
  );
}

type SectionProps = {
  children: React.ReactNode;
  className?: string;
};

export function CardHeader({ children, className = "" }: SectionProps) {
  return <div className={`mb-4 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = "" }: SectionProps) {
  return (
    <h4 className={`text-lg font-semibold text-gray-900 ${className}`}>
      {children}
    </h4>
  );
}

export function CardDescription({ children, className = "" }: SectionProps) {
  return (
    <p className={`text-sm text-gray-500 ${className}`}>
      {children}
    </p>
  );
}

export function CardContent({ children, className = "" }: SectionProps) {
  return <div className={`mb-4 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = "" }: SectionProps) {
  return <div className={`mt-4 flex justify-end ${className}`}>{children}</div>;
}

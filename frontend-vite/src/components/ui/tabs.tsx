import React, { useState } from "react";

type TabsProps = {
  children: React.ReactNode;
  defaultValue?: string;
  className?: string;
};

export function Tabs({ children, defaultValue = "all", className = "" }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child as React.ReactElement<{ activeTab?: string; setActiveTab?: (val: string) => void }>, {
              activeTab,
              setActiveTab,
            })
          : child
      )}
    </div>
  );
}

type TabsListProps = {
  children: React.ReactNode;
  className?: string;
};

export function TabsList({ children, className = "" }: TabsListProps) {
  return <div className={`flex gap-2 ${className}`}>{children}</div>;
}

type TabsTriggerProps = {
  value: string;
  children: React.ReactNode;
  activeTab?: string;
  setActiveTab?: (val: string) => void;
  className?: string;
};

export function TabsTrigger({
  value,
  children,
  activeTab,
  setActiveTab,
  className = "",
}: TabsTriggerProps) {
  const isActive = activeTab === value;
  return (
    <button
      onClick={() => setActiveTab && setActiveTab(value)}
      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
        isActive
          ? "bg-blue-600 text-white"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      } ${className}`}
    >
      {children}
    </button>
  );
}

type TabsContentProps = {
  value: string;
  children: React.ReactNode;
  activeTab?: string;
  className?: string;
};

export function TabsContent({
  value,
  children,
  activeTab,
  className = "",
}: TabsContentProps) {
  if (activeTab !== value) return null;
  return <div className={`mt-4 ${className}`}>{children}</div>;
}

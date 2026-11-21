"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

type SelectionOption = {
  value: string;
  label: string;
};

export function Selection({
  options,
  value,
  onSelect,
  placeholder = "Select",
}: {
  options: SelectionOption[];
  value: string;
  onSelect: (value: string) => void;
  placeholder?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(value || "");

  const handleToggle = () => setIsOpen(!isOpen);
  const handleOptionClick = (option: SelectionOption) => {
    onSelect(option.value);
    setSelected(option.value);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={handleToggle}
        className="rounded-[12px] border border-white/10 bg-[#0c0d12] px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 hover:border-white/20 cursor-pointer"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-2">
          {selected || placeholder}
          <ChevronDown
            className="size-4 opacity-50 transition-transform duration-200"
            style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0)" }}
          />
        </span>
      </button>

      {isOpen && (
        <div
          className="absolute top-full w-full rounded-[16px] border border-white/20 bg-[#0f1016] max-h-[250px] overflow-y-auto max-w-full z-50"
        >
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => handleOptionClick(option)}
              className="rounded-[12px] border border-white/10 bg-[#0c0d12] px-4 py-2.5 text-sm text-white cursor-pointer hover:bg-white/5 hover:text-white"
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
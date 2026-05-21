import React from "react";
import css from "../../styles/components/SearchBar.module.css";

interface SearchBarProps {
  value: string; 
  onChange: (texto: string) => void;
  placeholder?: string; 
}

export function SearchBar({ value, onChange, placeholder }: SearchBarProps) {
  return (
    <div className={css.searchContainer}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Buscar..."}
        className={css.searchInput}
      />
    </div>
  );
}
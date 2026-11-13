import { Search, X } from 'lucide-react';

export default function SearchField({ value, onChange, placeholder, label = 'Search' }) {
  return (
    <label className="search-field">
      <Search size={17} aria-hidden="true" />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={label}
      />
      {value ? (
        <button type="button" className="favorite-toggle" onClick={() => onChange('')} aria-label="Clear search">
          <X size={15} />
        </button>
      ) : null}
    </label>
  );
}

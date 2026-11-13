import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function Pagination({ page, totalPages, onPageChange, disabled = false }) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className="pagination" aria-label="Pagination">
      <button type="button" onClick={() => onPageChange(page - 1)} disabled={disabled || page <= 1}>
        <ArrowLeft size={14} /> Previous
      </button>
      <span>Page {page} of {totalPages}</span>
      <button type="button" onClick={() => onPageChange(page + 1)} disabled={disabled || page >= totalPages}>
        Next <ArrowRight size={14} />
      </button>
    </nav>
  );
}

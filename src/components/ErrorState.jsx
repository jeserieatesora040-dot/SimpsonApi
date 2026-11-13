import { TriangleAlert } from 'lucide-react';

export default function ErrorState({ message, onRetry }) {
  return (
    <section className="error-state" role="alert">
      <TriangleAlert size={25} />
      <h2>Springfield is having a moment</h2>
      <p>{message}</p>
      {onRetry ? <button type="button" className="button" onClick={onRetry}>Try again</button> : null}
    </section>
  );
}

export default function LoadingState({ message = 'Loading Springfield data?' }) {
  return (
    <div className="loading-state" aria-live="polite">
      <span className="spinner" />
      <p>{message}</p>
    </div>
  );
}

import { Bookmark, BookmarkCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../context/useFavorites';

function CharacterAvatar({ quote }) {
  if (!quote.characterImage) {
    return <span className="avatar-fallback" aria-hidden="true">{quote.characterName?.[0] || '?'}</span>;
  }

  return <img src={quote.characterImage} alt="" loading="lazy" />;
}

export default function QuoteCard({ quote }) {
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const saved = isFavorite(quote.id);

  return (
    <article className="quote-card">
      <div className="quote-card-top">
        <span className="quote-type">Character phrase</span>
        <button
          type="button"
          className={`favorite-toggle${saved ? ' is-saved' : ''}`}
          onClick={() => (saved ? removeFavorite(quote.id) : addFavorite(quote))}
          aria-label={saved ? 'Remove saved quote' : 'Save quote'}
          aria-pressed={saved}
          title={saved ? 'Remove saved quote' : 'Save quote'}
        >
          {saved ? <BookmarkCheck size={17} /> : <Bookmark size={17} />}
        </button>
      </div>
      <blockquote>?{quote.text}?</blockquote>
      <Link to={`/characters/${quote.characterId}`} className="quote-attribution">
        <CharacterAvatar quote={quote} />
        <span>
          <strong>{quote.characterName}</strong>
          <span>{quote.characterOccupation || 'Springfield resident'}</span>
        </span>
      </Link>
    </article>
  );
}

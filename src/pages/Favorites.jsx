import { Bookmark, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import QuoteCard from '../components/QuoteCard';
import SearchField from '../components/SearchField';
import { useFavorites } from '../context/useFavorites';

export default function Favorites() {
  const { favorites, clearFavorites } = useFavorites();
  const [search, setSearch] = useState('');

  const visibleFavorites = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    if (!query) {
      return favorites;
    }
    return favorites.filter((quote) =>
      `${quote.text} ${quote.characterName}`.toLocaleLowerCase().includes(query),
    );
  }, [favorites, search]);

  function handleClearFavorites() {
    if (window.confirm('Remove all saved phrases from this browser?')) {
      clearFavorites();
    }
  }

  return (
    <section className="container page-section">
      <header className="page-heading">
        <div>
          <span className="eyebrow"><Bookmark size={14} /> Your collection</span>
          <h1>Saved phrases</h1>
          <p>Your bookmarked quotes stay in this browser on this device.</p>
        </div>
        {favorites.length ? (
          <button type="button" className="button button-secondary" onClick={handleClearFavorites}>
            <Trash2 size={15} /> Clear saved
          </button>
        ) : null}
      </header>

      {favorites.length ? (
        <>
          <div className="directory-toolbar">
            <SearchField
              value={search}
              onChange={setSearch}
              placeholder="Search saved phrases?"
              label="Search saved phrases"
            />
            <span className="result-count">{visibleFavorites.length} of {favorites.length} saved</span>
          </div>
          {visibleFavorites.length ? (
            <div className="quote-grid">
              {visibleFavorites.map((quote) => <QuoteCard key={quote.id} quote={quote} />)}
            </div>
          ) : (
            <EmptyState
              title="No saved phrase matches"
              message="Try another search or clear the search field."
              action={<button type="button" className="button button-secondary" onClick={() => setSearch('')}>Clear search</button>}
            />
          )}
        </>
      ) : (
        <EmptyState
          title="Your quote wall is empty"
          message="Bookmark a phrase from the quote library or a character's profile and it will appear here."
          icon="bookmark"
          action={<Link to="/" className="button">Explore phrases</Link>}
        />
      )}
    </section>
  );
}

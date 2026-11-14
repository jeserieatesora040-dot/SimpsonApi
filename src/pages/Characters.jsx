import { useEffect, useMemo, useState } from 'react';
import CharacterCard from '../components/CharacterCard';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import LoadingState from '../components/LoadingState';
import Pagination from '../components/Pagination';
import SearchField from '../components/SearchField';
import { fetchCharacters } from '../services/simpsonsApi';

export default function Characters() {
  const [characters, setCharacters] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadCharacters() {
      setLoading(true);
      setError('');

      try {
        const result = await fetchCharacters(page, { signal: controller.signal });
        setCharacters(result.characters);
        setTotal(result.total);
        setTotalPages(result.totalPages);
      } catch (loadError) {
        if (loadError.name !== 'AbortError') {
          setError(loadError.message || 'Unable to load the character directory.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadCharacters();
    return () => controller.abort();
  }, [page, retryKey]);

  const filteredCharacters = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    if (!query) {
      return characters;
    }
    return characters.filter((character) =>
      `${character.name} ${character.occupation}`.toLocaleLowerCase().includes(query),
    );
  }, [characters, search]);

  return (
    <section className="container page-section">
      <header className="page-heading">
        <div>
          <span className="eyebrow">Meet the residents</span>
          <h1>Springfield's cast</h1>
          <p>Browse {total.toLocaleString()} characters from The Simpsons API directory.</p>
        </div>
      </header>

      <div className="directory-toolbar">
        <SearchField
          value={search}
          onChange={setSearch}
          placeholder="Search this page of characters?"
          label="Search characters on this page"
        />
        <span className="result-count">
          {filteredCharacters.length} of {characters.length} on this page
        </span>
      </div>

      {error ? (
        <ErrorState message={error} onRetry={() => setRetryKey((current) => current + 1)} />
      ) : loading ? (
        <LoadingState message="Loading the character directory?" />
      ) : filteredCharacters.length ? (
        <>
          <div className="character-grid">
            {filteredCharacters.map((character) => (
              <CharacterCard key={character.id} character={character} />
            ))}
          </div>
          {search ? (
            <p className="result-count" style={{ marginTop: 18 }}>Search checks the currently loaded page; clear it or move pages to find more characters.</p>
          ) : null}
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={(nextPage) => {
              setSearch('');
              setPage(nextPage);
            }}
            disabled={loading}
          />
        </>
      ) : (
        <EmptyState
          title="No characters on this page match"
          message="Search only checks the currently loaded page. Try another page or clear your search."
          icon="characters"
          action={<button type="button" className="button button-secondary" onClick={() => setSearch('')}>Clear search</button>}
        />
      )}
    </section>
  );
}

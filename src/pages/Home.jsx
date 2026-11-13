import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  BriefcaseBusiness,
  Bookmark,
  Quote,
  Shuffle,
  Sparkles,
  UsersRound,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import LoadingState from '../components/LoadingState';
import Pagination from '../components/Pagination';
import QuoteCard from '../components/QuoteCard';
import SearchField from '../components/SearchField';
import { useFavorites } from '../context/useFavorites';
import { fetchQuotes } from '../services/simpsonsApi';

const PAGE_SIZE = 12;

const categories = [
  { id: 'all', label: 'All phrases', detail: 'The whole first-page cast', icon: Quote },
  { id: 'family', label: 'Simpson family', detail: 'Characters named Simpson', icon: UsersRound },
  { id: 'school', label: 'School life', detail: 'Students and educators', icon: BookOpen },
  { id: 'work', label: 'Work & town', detail: 'Occupations from their profiles', icon: BriefcaseBusiness },
  { id: 'saved', label: 'Saved lines', detail: 'Your personal collection', icon: Bookmark },
];

function matchesCategory(quote, category, savedQuoteIds) {
  const occupation = quote.characterOccupation.toLocaleLowerCase();

  if (category === 'family') {
    return quote.characterName.toLocaleLowerCase().includes('simpson');
  }
  if (category === 'school') {
    return /student|school|teacher|principal|educator|superintendent/.test(occupation);
  }
  if (category === 'work') {
    return Boolean(occupation) && !/student|school|teacher|principal|educator|superintendent/.test(occupation);
  }
  if (category === 'saved') {
    return savedQuoteIds.has(quote.id);
  }
  return true;
}

export default function Home() {
  const { favorites } = useFavorites();
  const [quotes, setQuotes] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadQuotes() {
      setLoading(true);
      setError('');

      try {
        const results = await fetchQuotes({ signal: controller.signal });
        setQuotes(results);
        setFeaturedIndex(Math.floor(Math.random() * results.length));
      } catch (loadError) {
        if (loadError.name !== 'AbortError') {
          setError(loadError.message || 'Unable to load character phrases.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadQuotes();
    return () => controller.abort();
  }, [retryKey]);

  const savedQuoteIds = useMemo(() => new Set(favorites.map((quote) => quote.id)), [favorites]);

  const categoryQuotes = useMemo(
    () => quotes.filter((quote) => matchesCategory(quote, category, savedQuoteIds)),
    [quotes, category, savedQuoteIds],
  );

  const filteredQuotes = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    if (!query) {
      return categoryQuotes;
    }
    return categoryQuotes.filter((quote) =>
      `${quote.text} ${quote.characterName}`.toLocaleLowerCase().includes(query),
    );
  }, [categoryQuotes, search]);

  const categoryCounts = useMemo(
    () => Object.fromEntries(
      categories.map(({ id }) => [
        id,
        quotes.filter((quote) => matchesCategory(quote, id, savedQuoteIds)).length,
      ]),
    ),
    [quotes, savedQuoteIds],
  );

  const totalPages = Math.max(1, Math.ceil(filteredQuotes.length / PAGE_SIZE));
  const visibleQuotes = filteredQuotes.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const featuredQuote = quotes[featuredIndex];

  function chooseAnotherQuote() {
    if (quotes.length < 2) {
      return;
    }
    setFeaturedIndex((current) => {
      const offset = 1 + Math.floor(Math.random() * (quotes.length - 1));
      return (current + offset) % quotes.length;
    });
  }

  function selectCategory(nextCategory) {
    setCategory(nextCategory);
    setPage(1);
  }

  function updateSearch(value) {
    setSearch(value);
    setPage(1);
  }

  return (
    <div className="home-page">
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-stage">
            <div className="hero-skyline" aria-hidden="true">
              <span className="skyline-building skyline-building-one" />
              <span className="skyline-building skyline-building-two" />
              <span className="skyline-building skyline-building-three" />
              <span className="skyline-sun" />
            </div>

            <div className="hero-heading">
              <span className="hero-kicker"><Sparkles size={13} /> The Simpsons ? character phrases</span>
              <h1>Springfield <span>Lines</span></h1>
            </div>

            <p className="hero-intro">The town is full of characters.<br />These are a few of their words.</p>

            {featuredQuote?.characterImage ? (
              <img className="hero-character" src={featuredQuote.characterImage} alt="" />
            ) : null}

            <div className="hero-quote-card">
              {loading ? (
                <LoadingState message="Tuning into Springfield?" />
              ) : error ? (
                <p className="hero-error">{error}</p>
              ) : featuredQuote ? (
                <>
                  <div className="hero-quote-label"><Quote size={14} /> Quote spotlight</div>
                  <blockquote>?{featuredQuote.text}?</blockquote>
                  <Link to={`/characters/${featuredQuote.characterId}`} className="hero-attribution">
                    <span>{featuredQuote.characterName}</span>
                    <ArrowUpRight size={14} />
                  </Link>
                  <button type="button" className="hero-surprise" onClick={chooseAnotherQuote}>
                    <Shuffle size={13} /> Surprise me
                  </button>
                </>
              ) : null}
            </div>

            <div className="hero-note">
              <span className="hero-note-dot" />
              <span>REAL-TIME API</span>
              <strong>{quotes.length || '?'} phrases</strong>
              <small>from the featured cast</small>
            </div>

            <div className="hero-bottomline">
              <span>THE QUOTE COLLECTION</span>
              <span>01 ? SPRINGFIELD</span>
            </div>
          </div>

          <div className="category-dock" role="group" aria-label="Filter quotes by category">
            {categories.map(({ id, label, detail, icon: Icon }, index) => {
              const count = categoryCounts[id] ?? 0;
              return (
                <button
                  type="button"
                  key={id}
                  className={`category-tile category-tile-${id}${category === id ? ' is-active' : ''}`}
                  onClick={() => selectCategory(id)}
                  aria-pressed={category === id}
                >
                  <span className="category-tile-icon"><Icon size={18} /></span>
                  <span className="category-tile-copy">
                    <small>{`0${index + 1} / CATEGORY`}</small>
                    <strong>{label}</strong>
                    <span>{detail}</span>
                    <b>{count} {count === 1 ? 'phrase' : 'phrases'}</b>
                  </span>
                  <ArrowUpRight className="category-tile-arrow" size={16} />
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="container quote-section" id="quote-library">
        <div className="section-heading">
          <div>
            <span className="eyebrow">01 / The quote archive</span>
            <h2>{categories.find((item) => item.id === category)?.label}</h2>
            <p>Search by phrase or character, or choose another collection above.</p>
          </div>
          <Link className="section-link" to="/characters">Browse all characters <ArrowRight size={15} /></Link>
        </div>

        {error ? (
          <ErrorState message={error} onRetry={() => setRetryKey((current) => current + 1)} />
        ) : loading ? (
          <LoadingState />
        ) : (
          <>
            <div className="quote-toolbar">
              <SearchField
                value={search}
                onChange={updateSearch}
                placeholder="Search a phrase or character?"
                label="Search phrases and characters"
              />
              <span className="result-count">
                {filteredQuotes.length} {filteredQuotes.length === 1 ? 'phrase' : 'phrases'}
              </span>
            </div>

            {visibleQuotes.length ? (
              <>
                <div className="quote-grid">
                  {visibleQuotes.map((quote) => <QuoteCard key={quote.id} quote={quote} />)}
                </div>
                <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
              </>
            ) : (
              <EmptyState
                title="No phrases in this collection yet"
                message={category === 'saved'
                  ? 'Save a character phrase to build your collection.'
                  : 'Try a different search or choose another category.'}
                icon={category === 'saved' ? 'bookmark' : 'search'}
                action={category === 'saved'
                  ? <button type="button" className="button button-secondary" onClick={() => selectCategory('all')}>Explore all phrases</button>
                  : <button type="button" className="button button-secondary" onClick={() => updateSearch('')}>Clear search</button>}
              />
            )}
          </>
        )}
      </section>
    </div>
  );
}

import { ArrowLeft, Bookmark, Quote } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import LoadingState from '../components/LoadingState';
import QuoteCard from '../components/QuoteCard';
import { fetchCharacterById, getCharacterQuotes } from '../services/simpsonsApi';

function displayAge(age) {
  return age === null || age === undefined || age === '' ? 'Not listed' : `${age}`;
}

export default function CharacterDetails() {
  const { id } = useParams();
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadCharacter() {
      setLoading(true);
      setError('');
      setCharacter(null);

      try {
        setCharacter(await fetchCharacterById(id, { signal: controller.signal }));
      } catch (loadError) {
        if (loadError.name !== 'AbortError') {
          setError(loadError.message || 'Unable to load this character.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadCharacter();
    return () => controller.abort();
  }, [id, retryKey]);

  if (loading) {
    return <div className="container"><LoadingState message="Looking up this Springfield resident?" /></div>;
  }

  if (error) {
    return (
      <div className="container">
        <ErrorState message={error} onRetry={() => setRetryKey((current) => current + 1)} />
      </div>
    );
  }

  if (!character) {
    return null;
  }

  const quotes = getCharacterQuotes(character);

  return (
    <section className="container character-detail">
      <Link to="/characters" className="detail-back"><ArrowLeft size={15} /> Back to characters</Link>
      <article className="character-profile">
        <div className="profile-image">
          {character.image ? (
            <img src={character.image} alt={character.name} />
          ) : (
            <span className="character-initial">{character.name[0]}</span>
          )}
        </div>
        <div className="profile-copy">
          <span className="eyebrow">Springfield character ? #{character.id}</span>
          <h1>{character.name}</h1>
          <p>{character.description || 'No biography is available for this character.'}</p>
          <div className="profile-facts">
            <span className="profile-fact"><span>Occupation</span>{character.occupation || 'Not listed'}</span>
            <span className="profile-fact"><span>Age</span>{displayAge(character.age)}</span>
            {character.gender ? <span className="profile-fact"><span>Gender</span>{character.gender}</span> : null}
            {character.status ? <span className="profile-fact"><span>Status</span>{character.status}</span> : null}
          </div>
          <span className="eyebrow"><Quote size={14} /> {quotes.length} phrases in the API record</span>
        </div>
      </article>

      <div className="section-heading" style={{ marginTop: 44 }}>
        <div>
          <span className="eyebrow"><Bookmark size={13} /> Character phrases</span>
          <h2>What {character.name.split(' ')[0]} says</h2>
          <p>Phrases supplied with this character's API profile. Save any you want to keep.</p>
        </div>
      </div>
      {quotes.length ? (
        <div className="quote-grid">
          {quotes.map((quote) => <QuoteCard key={quote.id} quote={quote} />)}
        </div>
      ) : (
        <EmptyState
          title="No phrases listed"
          message="The API has not provided any phrases for this character."
          icon="search"
        />
      )}
    </section>
  );
}

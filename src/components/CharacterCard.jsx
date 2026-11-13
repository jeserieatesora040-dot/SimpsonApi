import { ArrowUpRight, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CharacterCard({ character }) {
  return (
    <Link to={`/characters/${character.id}`} className="character-card">
      <div className="character-image">
        {character.image ? (
          <img src={character.image} alt={character.name} loading="lazy" />
        ) : (
          <span className="character-initial" aria-hidden="true">{character.name[0]}</span>
        )}
      </div>
      <div className="character-card-copy">
        <h2>{character.name}</h2>
        <p>{character.occupation || 'Springfield resident'}</p>
        <div className="character-card-meta">
          <span>{character.status || 'Springfield'}</span>
          <span><Quote size={13} /> {character.phrases.length} phrases <ArrowUpRight size={13} /></span>
        </div>
      </div>
    </Link>
  );
}

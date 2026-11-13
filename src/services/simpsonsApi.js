const API_BASE_URL = 'https://thesimpsonsapi.com/api';
const IMAGE_BASE_URL = 'https://cdn.thesimpsonsapi.com/500';

function normalizeCharacter(record) {
  if (!record || !Number.isInteger(Number(record.id)) || !record.name) {
    throw new Error('The Simpsons API returned an invalid character record.');
  }

  return {
    id: Number(record.id),
    name: record.name,
    age: record.age ?? null,
    gender: record.gender || '',
    occupation: record.occupation || '',
    status: record.status || '',
    description: record.description || '',
    birthdate: record.birthdate || '',
    image: record.portrait_path ? `${IMAGE_BASE_URL}${record.portrait_path}` : '',
    phrases: Array.isArray(record.phrases)
      ? record.phrases.filter((phrase) => typeof phrase === 'string' && phrase.trim())
      : [],
  };
}

async function requestJson(path, signal) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: { Accept: 'application/json' },
      signal,
    });
  } catch (error) {
    if (error.name === 'AbortError') {
      throw error;
    }

    throw new Error(`Could not connect to The Simpsons API: ${error.message}`);
  }

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('That Simpsons character could not be found.');
    }

    throw new Error(`The Simpsons API request failed (${response.status}). Please try again.`);
  }

  try {
    return await response.json();
  } catch {
    throw new Error('The Simpsons API returned an unreadable response.');
  }
}

export async function fetchCharacters(page = 1, { signal } = {}) {
  if (!Number.isInteger(page) || page < 1) {
    throw new Error('Character page must be a positive whole number.');
  }

  const result = await requestJson(`/characters?page=${page}`, signal);

  if (!Array.isArray(result.results) || !Number.isFinite(result.pages)) {
    throw new Error('The Simpsons API returned an unexpected character list.');
  }

  return {
    characters: result.results.map(normalizeCharacter),
    total: Number(result.count) || 0,
    page,
    totalPages: result.pages,
  };
}

export async function fetchCharacterById(id, { signal } = {}) {
  const characterId = Number(id);
  if (!Number.isSafeInteger(characterId) || characterId < 1) {
    throw new Error('Character ID must be a positive whole number.');
  }

  const result = await requestJson(`/characters/${characterId}`, signal);
  return normalizeCharacter(result);
}

export function getCharacterQuotes(character) {
  return character.phrases.map((text, index) => ({
    id: `${character.id}-${index}`,
    text,
    characterId: character.id,
    characterName: character.name,
    characterImage: character.image,
    characterOccupation: character.occupation,
  }));
}

export async function fetchQuotes({ signal } = {}) {
  const { characters } = await fetchCharacters(1, { signal });
  return characters.flatMap(getCharacterQuotes);
}

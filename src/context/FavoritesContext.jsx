import { useState } from 'react';
import { FavoritesContext } from './favoriteContextValue';

const STORAGE_KEY = 'springfield-lines-favorites';

function readFavorites() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : [];

    if (!Array.isArray(parsed)) {
      throw new Error('Saved quotes are not in the expected format.');
    }

    return {
      favorites: parsed.filter(
        (quote) => quote && typeof quote.id === 'string' && typeof quote.text === 'string',
      ),
      error: '',
    };
  } catch (error) {
    return {
      favorites: [],
      error: `Saved quotes could not be read from this browser: ${error.message}`,
    };
  }
}

export function FavoritesProvider({ children }) {
  const [initialState] = useState(readFavorites);
  const [favorites, setFavorites] = useState(initialState.favorites);
  const [storageError, setStorageError] = useState(initialState.error);

  function persistFavorites(nextFavorites) {
    setFavorites(nextFavorites);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextFavorites));
      setStorageError('');
    } catch (error) {
      setStorageError(`Saved quotes could not be stored in this browser: ${error.message}`);
    }
  }

  function addFavorite(quote) {
    if (!favorites.some((item) => item.id === quote.id)) {
      persistFavorites([quote, ...favorites]);
    }
  }

  function removeFavorite(quoteId) {
    persistFavorites(favorites.filter((quote) => quote.id !== quoteId));
  }

  function clearFavorites() {
    persistFavorites([]);
  }

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        clearFavorites,
        isFavorite: (quoteId) => favorites.some((quote) => quote.id === quoteId),
        storageError,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

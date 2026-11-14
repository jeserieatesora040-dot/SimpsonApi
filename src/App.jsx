import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { FavoritesProvider } from './context/FavoritesContext';
import { useFavorites } from './context/useFavorites';
import CharacterDetails from './pages/CharacterDetails';
import Characters from './pages/Characters';
import Favorites from './pages/Favorites';
import Home from './pages/Home';
import './App.css';

function AppContent() {
  const { storageError } = useFavorites();

  return (
    <div className="app-shell">
      <Navbar />
      {storageError ? <div className="storage-notice" role="status">{storageError}</div> : null}
      <main className="page-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/characters" element={<Characters />} />
          <Route path="/characters/:id" element={<CharacterDetails />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <FavoritesProvider>
        <AppContent />
      </FavoritesProvider>
    </BrowserRouter>
  );
}

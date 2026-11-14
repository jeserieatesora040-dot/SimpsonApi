import { Bookmark, Search, UsersRound } from 'lucide-react';

const icons = { bookmark: Bookmark, search: Search, characters: UsersRound };

export default function EmptyState({ title, message, icon = 'search', action = null }) {
  const Icon = icons[icon] || Search;

  return (
    <div className="empty-state">
      <span className="empty-icon"><Icon size={22} /></span>
      <h2>{title}</h2>
      <p>{message}</p>
      {action}
    </div>
  );
}

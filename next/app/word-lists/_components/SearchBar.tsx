import { Search } from 'lucide-react';
import { Input } from 'app/components/ui/input';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const SearchBar = ({ searchQuery, onSearchChange }: SearchBarProps) => (
  <div className="p-4">
    <div className="relative">
      <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
      <Input
        placeholder="Search words..."
        className="pl-12 pr-4 py-3 rounded-full border-2 border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 focus:ring-opacity-50 text-lg w-full shadow-md"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  </div>
);

export default SearchBar;

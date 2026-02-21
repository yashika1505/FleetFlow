import { Search } from "lucide-react";

interface SearchFilterBarProps {
  searchPlaceholder?: string;
  groupByOptions?: string[];
  filterOptions?: string[];
  sortOptions?: string[];
}

export default function SearchFilterBar({
  searchPlaceholder = "Search...",
  groupByOptions = ["None"],
  filterOptions = ["All"],
  sortOptions = ["Default"],
}: SearchFilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder={searchPlaceholder}
          className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-input bg-card focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all"
        />
      </div>
      <select className="px-3 py-2 text-sm rounded-lg border border-input bg-card text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30">
        {groupByOptions.map((o) => (
          <option key={o}>Group: {o}</option>
        ))}
      </select>
      <select className="px-3 py-2 text-sm rounded-lg border border-input bg-card text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30">
        {filterOptions.map((o) => (
          <option key={o}>Filter: {o}</option>
        ))}
      </select>
      <select className="px-3 py-2 text-sm rounded-lg border border-input bg-card text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30">
        {sortOptions.map((o) => (
          <option key={o}>Sort: {o}</option>
        ))}
      </select>
    </div>
  );
}

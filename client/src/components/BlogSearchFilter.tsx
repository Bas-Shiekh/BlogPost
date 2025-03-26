"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Search, SortAsc, SortDesc, Filter } from "lucide-react";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/Select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "./ui/DropdownMenu";

export type SearchField = "all" | "title" | "content" | "author";
export type SortField = "createdAt" | "updatedAt";
export type SortOrder = "asc" | "desc";

export interface SearchFilters {
  searchTerm: string;
  searchField: SearchField;
  sortField: SortField;
  sortOrder: SortOrder;
}

interface BlogSearchFilterProps {
  onFilterChange: (filters: SearchFilters) => void;
  initialFilters?: Partial<SearchFilters>;
}

const BlogSearchFilter = ({
  onFilterChange,
  initialFilters,
}: BlogSearchFilterProps) => {
  // Use refs to track if this is the initial render
  const isInitialMount = useRef(true);

  // Initialize state from props
  const [searchTerm, setSearchTerm] = useState(
    initialFilters?.searchTerm || ""
  );
  const [searchField, setSearchField] = useState<SearchField>(
    initialFilters?.searchField || "all"
  );
  const [sortField, setSortField] = useState<SortField>(
    initialFilters?.sortField || "createdAt"
  );
  const [sortOrder, setSortOrder] = useState<SortOrder>(
    initialFilters?.sortOrder || "desc"
  );

  // Create a debounced version of the filter change handler
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  // Handle search term with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // This function will actually trigger the filter change
  const applyFilters = useCallback(() => {
    if (!isInitialMount.current) {
      onFilterChange({
        searchTerm: debouncedSearchTerm,
        searchField,
        sortField,
        sortOrder,
      });
    }
  }, [debouncedSearchTerm, searchField, sortField, sortOrder, onFilterChange]);

  // Apply filters when debounced search term changes
  useEffect(() => {
    applyFilters();
  }, [debouncedSearchTerm, applyFilters]);

  // Apply filters when other filter options change
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Only apply if it's not a search term change (which is handled by the debounce)
    if (debouncedSearchTerm === searchTerm) {
      applyFilters();
    }
  }, [
    searchField,
    sortField,
    sortOrder,
    applyFilters,
    debouncedSearchTerm,
    searchTerm,
  ]);

  // Handle clear button click
  const handleClear = () => {
    setSearchTerm("");
    // We don't need to call applyFilters here as the effect will handle it
  };

  // Handle search field change
  const handleSearchFieldChange = (value: string) => {
    console.log("Search field changed to:", value);
    setSearchField(value as SearchField);
  };

  // Handle sort field change
  const handleSortFieldChange = (value: string) => {
    console.log("Sort field changed to:", value);
    setSortField(value as SortField);
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex gap-2 items-center">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Search in</span>
                <span className="font-medium">
                  {searchField === "all"
                    ? "All Fields"
                    : searchField.charAt(0).toUpperCase() +
                      searchField.slice(1)}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuRadioGroup
                value={searchField}
                onValueChange={handleSearchFieldChange}
              >
                <DropdownMenuRadioItem value="all">
                  All Fields
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="title">
                  Title
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="content">
                  Content
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="author">
                  Author
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Select value={sortField} onValueChange={handleSortFieldChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Created Date</SelectItem>
              <SelectItem value="updatedAt">Updated Date</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            title={sortOrder === "asc" ? "Ascending" : "Descending"}
          >
            {sortOrder === "asc" ? (
              <SortAsc className="h-4 w-4" />
            ) : (
              <SortDesc className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {searchTerm && (
        <div className="flex items-center text-sm text-muted-foreground">
          <span>
            Searching for "
            <span className="font-medium text-foreground">{searchTerm}</span>"
            in{" "}
            <span className="font-medium text-foreground">
              {searchField === "all" ? "all fields" : searchField}
            </span>
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="ml-2 h-auto p-1"
            onClick={handleClear}
          >
            Clear
          </Button>
        </div>
      )}
    </div>
  );
}

export default BlogSearchFilter;

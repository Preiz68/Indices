"use client";
import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import { Button } from "./ui/button";
import { Loader2, Star, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { searchStocks } from "@/lib/actions/massive.actions";
import { useDebounce } from "@/hooks/use-debounce"; // Assuming this hook exists or I'll add it

export function SearchCommand({
  renderAs = "button",
  label = "Add stock",
  initialStocks = [],
}: {
  renderAs?: "button" | "text";
  label?: string;
  initialStocks?: StockWithWatchlistStatus[];
}) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [stocks, setStocks] = useState<StockWithWatchlistStatus[]>(
    initialStocks as StockWithWatchlistStatus[]
  );
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const isSearchMode = !!searchTerm.trim();
  const displayStocks = isSearchMode ? stocks : initialStocks?.slice(0, 10);

  useEffect(() => {
    if (!debouncedSearchTerm.trim()) {
      setStocks(initialStocks as StockWithWatchlistStatus[]);
      return;
    }

    const fetchStocks = async () => {
      setLoading(true);
      try {
        const results = await searchStocks(debouncedSearchTerm);
        setStocks(results);
      } catch (error) {
        console.error("Failed to search stocks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStocks();
  }, [debouncedSearchTerm, initialStocks]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setStocks(initialStocks);
    }
  }, [initialStocks, searchTerm]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelectStock = (symbol: string) => {
    console.log(`Stock selected: ${symbol}`);
    setOpen(false);
  };

  return (
    <>
      {renderAs === "text" ? (
        <span onClick={() => setOpen(true)} className="search-text">
          {label}
        </span>
      ) : (
        <Button onClick={() => setOpen(true)} className="search-button">
          {label}
        </Button>
      )}
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        className="search-dialog"
      >
        <div className="search-field">
          <CommandInput
            placeholder="Search stocks..."
            value={searchTerm}
            onValueChange={setSearchTerm}
            className="search-input"
          />
          {loading && <Loader2 className="search-loader" />}
        </div>
        <CommandList className="search-list">
          {loading ? (
            <CommandEmpty className="search-list-empty">
              Loading stocks...
            </CommandEmpty>
          ) : displayStocks?.length === 0 ? (
            <div className="search-list-indicator">
              {isSearchMode ? "No results found" : "No stocks available"}
            </div>
          ) : (
            <ul>
              <div className="search-count">
                {isSearchMode ? "Search Results" : "Top Stocks"}(
                {displayStocks?.length || 0})
              </div>
              {displayStocks?.map((stock) => (
                <li key={stock.symbol} className="search-item">
                  <Link
                    href={`/stocks/${stock.symbol}`}
                    onClick={() => handleSelectStock(stock.symbol)}
                    className="search-item-link"
                  >
                    <TrendingUp className="size-4 text-gray-500" />
                    <div className="flex-1">
                      <div className="search-item-name">{stock.name}</div>
                      <div className="text-sm text-gray-500">
                        {stock.symbol} | {stock.exchange} | {stock.type}
                      </div>
                    </div>
                    <Star />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}

import { useState, useEffect, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchInputProps {
    onSearch: (query: string) => void;
    placeholder?: string;
    initialValue?: string;
}

export function SearchInput({
    onSearch,
    placeholder = "Buscar vagas...",
    initialValue = ""
}: SearchInputProps) {
    const [query, setQuery] = useState(initialValue);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            onSearch(query);
        }, 300);

        return () => clearTimeout(timer);
    }, [query, onSearch]);

    const handleClear = useCallback(() => {
        setQuery('');
        onSearch('');
    }, [onSearch]);

    return (
        <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
                type="text"
                placeholder={placeholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 pr-10"
            />
            {query && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClear}
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                >
                    <X className="w-4 h-4" />
                </Button>
            )}
        </div>
    );
}

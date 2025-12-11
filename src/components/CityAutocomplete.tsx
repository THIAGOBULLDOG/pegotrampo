import { useState, useMemo, useCallback } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

interface CityOption {
    value: string;
    label: string;
}

interface CityAutocompleteProps {
    cities: CityOption[];
    value: string;
    onValueChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
}

export function CityAutocomplete({
    cities,
    value,
    onValueChange,
    placeholder = "Selecione uma cidade...",
    disabled = false,
}: CityAutocompleteProps) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');

    // Filter cities based on search - limit results for performance
    const filteredCities = useMemo(() => {
        if (!search) return cities.slice(0, 100);

        const searchLower = search.toLowerCase();
        return cities
            .filter(city => city.label.toLowerCase().includes(searchLower))
            .slice(0, 50);
    }, [cities, search]);

    const selectedCity = useMemo(() => {
        return cities.find(city => city.value === value);
    }, [cities, value]);

    const handleSelect = useCallback((currentValue: string) => {
        onValueChange(currentValue === value ? '' : currentValue);
        setOpen(false);
        setSearch('');
    }, [value, onValueChange]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                    disabled={disabled}
                >
                    {selectedCity ? selectedCity.label : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
                <Command shouldFilter={false}>
                    <CommandInput
                        placeholder="Buscar cidade..."
                        value={search}
                        onValueChange={setSearch}
                    />
                    <CommandList>
                        <CommandEmpty>Nenhuma cidade encontrada.</CommandEmpty>
                        <CommandGroup>
                            {filteredCities.map((city) => (
                                <CommandItem
                                    key={city.value}
                                    value={city.value}
                                    onSelect={handleSelect}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === city.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {city.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

import { useState, useMemo, useCallback } from 'react';
import { Search, MapPin, DollarSign, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { brazilStates, citiesByState, jobTypes, salaryRanges } from '@/data/brazilLocations';

interface JobFiltersProps {
  onFilterChange: (filters: {
    state: string;
    city: string;
    jobType: string;
    minSalary: string;
  }) => void;
}

export function JobFilters({ onFilterChange }: JobFiltersProps) {
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [citySearch, setCitySearch] = useState('');
  const [jobType, setJobType] = useState('');
  const [minSalary, setMinSalary] = useState('');
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  const cities = state ? citiesByState[state] || [] : [];

  // Filter cities based on search with live filtering
  const filteredCities = useMemo(() => {
    if (!citySearch.trim()) return cities.slice(0, 20);

    const searchLower = citySearch.toLowerCase();
    return cities
      .filter(c => c.label.toLowerCase().includes(searchLower))
      .slice(0, 50);
  }, [cities, citySearch]);

  const handleStateChange = (value: string) => {
    setState(value);
    setCity('');
    setCitySearch('');
    onFilterChange({ state: value, city: '', jobType, minSalary });
  };

  const handleCitySelect = useCallback((value: string, label: string) => {
    setCity(value);
    setCitySearch(label);
    setShowCityDropdown(false);
    onFilterChange({ state, city: value, jobType, minSalary });
  }, [state, jobType, minSalary, onFilterChange]);

  const handleCitySearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCitySearch(e.target.value);
    setShowCityDropdown(true);
    if (!e.target.value) {
      setCity('');
      onFilterChange({ state, city: '', jobType, minSalary });
    }
  };

  const handleJobTypeChange = (value: string) => {
    setJobType(value);
    onFilterChange({ state, city, jobType: value, minSalary });
  };

  const handleSalaryChange = (value: string) => {
    setMinSalary(value);
    onFilterChange({ state, city, jobType, minSalary: value });
  };

  const clearFilters = () => {
    setState('');
    setCity('');
    setCitySearch('');
    setJobType('');
    setMinSalary('');
    onFilterChange({ state: '', city: '', jobType: '', minSalary: '' });
  };

  return (
    <div className="bg-card rounded-2xl shadow-card p-6 border border-border/50">
      <div className="flex items-center gap-2 mb-6">
        <Filter className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Filtrar Vagas</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* State */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Estado
          </label>
          <Select value={state} onValueChange={handleStateChange}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Selecione o estado" />
            </SelectTrigger>
            <SelectContent className="bg-popover z-50">
              {brazilStates.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* City with Autocomplete */}
        <div className="space-y-2 relative">
          <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Cidade
          </label>
          <Input
            type="text"
            placeholder={state ? "Digite para buscar..." : "Selecione um estado primeiro"}
            value={citySearch}
            onChange={handleCitySearchChange}
            onFocus={() => state && setShowCityDropdown(true)}
            onBlur={() => setTimeout(() => setShowCityDropdown(false), 200)}
            disabled={!state}
            className="bg-background"
          />

          {/* Dropdown */}
          {showCityDropdown && filteredCities.length > 0 && (
            <div className="absolute z-50 w-full mt-1 max-h-60 overflow-auto bg-popover border border-border rounded-lg shadow-lg">
              {filteredCities.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => handleCitySelect(c.value, c.label)}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  {c.label}
                </button>
              ))}
              {cities.length > filteredCities.length && (
                <div className="px-3 py-2 text-xs text-muted-foreground border-t">
                  Digite para ver mais cidades...
                </div>
              )}
            </div>
          )}
        </div>

        {/* Job Type */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Search className="w-4 h-4" />
            Tipo de Vaga
          </label>
          <Select value={jobType} onValueChange={handleJobTypeChange}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Todos os tipos" />
            </SelectTrigger>
            <SelectContent className="bg-popover z-50">
              {jobTypes.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Salary */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Salário Mínimo
          </label>
          <Select value={minSalary} onValueChange={handleSalaryChange}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Qualquer valor" />
            </SelectTrigger>
            <SelectContent className="bg-popover z-50">
              {salaryRanges.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Clear filters */}
      {(state || city || jobType || minSalary) && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="mt-4 text-muted-foreground hover:text-foreground"
        >
          Limpar filtros
        </Button>
      )}
    </div>
  );
}

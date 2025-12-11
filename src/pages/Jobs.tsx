import { useState, useMemo, useCallback } from 'react';
import { Heart, Briefcase, ArrowLeft, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { JobCard } from '@/components/JobCard';
import { JobFilters } from '@/components/JobFilters';
import { SearchInput } from '@/components/SearchInput';
import { Pagination } from '@/components/Pagination';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useJobs } from '@/hooks/useJobs';

export default function Jobs() {
  const {
    jobs,
    paginatedJobs,
    toggleFavorite,
    isFavorite,
    favorites,
    isLoading,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    totalPages,
  } = useJobs();

  const [filters, setFilters] = useState({
    state: '',
    city: '',
    jobType: '',
    minSalary: '',
  });
  const [activeTab, setActiveTab] = useState('all');

  // Apply additional filters on top of search
  const filteredJobs = useMemo(() => {
    let result = jobs;

    if (filters.state) {
      result = result.filter(job => job.state === filters.state);
    }
    if (filters.city) {
      result = result.filter(job => job.city === filters.city);
    }
    if (filters.jobType && filters.jobType !== 'todos') {
      result = result.filter(job => job.jobType === filters.jobType);
    }
    if (filters.minSalary) {
      const minSalary = parseFloat(filters.minSalary);
      result = result.filter(job => job.salary >= minSalary);
    }

    return result;
  }, [jobs, filters]);

  // Paginate filtered jobs
  const displayedJobs = useMemo(() => {
    const hasFilters = filters.state || filters.city || filters.jobType || filters.minSalary;
    if (hasFilters) {
      const startIndex = (currentPage - 1) * 9;
      return filteredJobs.slice(startIndex, startIndex + 9);
    }
    return paginatedJobs;
  }, [filteredJobs, paginatedJobs, filters, currentPage]);

  const displayTotalPages = useMemo(() => {
    const hasFilters = filters.state || filters.city || filters.jobType || filters.minSalary;
    if (hasFilters) {
      return Math.ceil(filteredJobs.length / 9);
    }
    return totalPages;
  }, [filteredJobs, totalPages, filters]);

  const favoriteJobs = useMemo(() => {
    return jobs.filter(job => favorites.includes(job.id));
  }, [jobs, favorites]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, [setSearchQuery]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [setCurrentPage]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-12 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Carregando vagas...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Back button */}
          <Link to="/">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>

          {/* Page title */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Vagas Temporárias
            </h1>
            <p className="text-muted-foreground">
              Encontre a oportunidade perfeita para você
            </p>
          </div>

          {/* Warning Banner */}
          <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
            <p className="text-sm text-amber-600 dark:text-amber-400 font-medium text-center">
              ⚠️ REGRA: SE VOCÊ NÃO TEM A QUALIFICAÇÃO NECESSÁRIA PARA A VAGA, NÃO SE CANDIDATE.
            </p>
          </div>

          {/* Search */}
          <div className="mb-6 max-w-xl">
            <SearchInput
              onSearch={handleSearch}
              placeholder="Buscar por título, descrição ou empregador..."
              initialValue={searchQuery}
            />
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="bg-secondary">
              <TabsTrigger value="all" className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Todas as Vagas
              </TabsTrigger>
              <TabsTrigger value="favorites" className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Favoritas ({favorites.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              {/* Filters */}
              <JobFilters onFilterChange={setFilters} />

              {/* Results count */}
              <p className="text-sm text-muted-foreground mt-6 mb-4">
                {filteredJobs.length} vaga{filteredJobs.length !== 1 ? 's' : ''} encontrada{filteredJobs.length !== 1 ? 's' : ''}
              </p>

              {/* Job grid */}
              {displayedJobs.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayedJobs.map(job => (
                      <JobCard
                        key={job.id}
                        job={job}
                        isFavorite={isFavorite(job.id)}
                        onToggleFavorite={() => toggleFavorite(job.id)}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  <Pagination
                    currentPage={currentPage}
                    totalPages={displayTotalPages}
                    onPageChange={handlePageChange}
                  />
                </>
              ) : (
                <div className="text-center py-16">
                  <Briefcase className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Nenhuma vaga encontrada
                  </h3>
                  <p className="text-muted-foreground">
                    Tente ajustar os filtros para encontrar mais oportunidades
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="favorites" className="mt-6">
              {favoriteJobs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favoriteJobs.map(job => (
                    <JobCard
                      key={job.id}
                      job={job}
                      isFavorite={true}
                      onToggleFavorite={() => toggleFavorite(job.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Heart className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Nenhuma vaga favorita
                  </h3>
                  <p className="text-muted-foreground">
                    Clique no coração para salvar vagas do seu interesse
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    showFirstLast?: boolean;
}

export function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    showFirstLast = true
}: PaginationProps) {
    if (totalPages <= 1) return null;

    const getVisiblePages = () => {
        const delta = 2;
        const range: number[] = [];
        const rangeWithDots: (number | string)[] = [];

        for (
            let i = Math.max(2, currentPage - delta);
            i <= Math.min(totalPages - 1, currentPage + delta);
            i++
        ) {
            range.push(i);
        }

        if (currentPage - delta > 2) {
            rangeWithDots.push(1, '...');
        } else {
            rangeWithDots.push(1);
        }

        rangeWithDots.push(...range);

        if (currentPage + delta < totalPages - 1) {
            rangeWithDots.push('...', totalPages);
        } else if (totalPages > 1) {
            rangeWithDots.push(totalPages);
        }

        return rangeWithDots;
    };

    const visiblePages = getVisiblePages();

    return (
        <div className="flex items-center justify-center gap-1 mt-8">
            {showFirstLast && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(1)}
                    disabled={currentPage === 1}
                    className="hidden sm:flex"
                >
                    <ChevronsLeft className="w-4 h-4" />
                </Button>
            )}

            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <ChevronLeft className="w-4 h-4" />
            </Button>

            <div className="flex items-center gap-1">
                {visiblePages.map((page, index) => (
                    typeof page === 'number' ? (
                        <Button
                            key={index}
                            variant={currentPage === page ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => onPageChange(page)}
                            className="min-w-[36px]"
                        >
                            {page}
                        </Button>
                    ) : (
                        <span key={index} className="px-2 text-muted-foreground">
                            {page}
                        </span>
                    )
                ))}
            </div>

            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                <ChevronRight className="w-4 h-4" />
            </Button>

            {showFirstLast && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="hidden sm:flex"
                >
                    <ChevronsRight className="w-4 h-4" />
                </Button>
            )}
        </div>
    );
}

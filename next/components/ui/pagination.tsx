import React from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'

interface PaginationProps {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
  recordsText?: string
}

export const Pagination: React.FC<PaginationProps> = ({ page, pageSize, total, onPageChange, recordsText = '' }) => {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  return (
    <div className="flex justify-center mt-4 items-center gap-1 select-none">
      <span 
        className={`cursor-pointer px-2 py-1 text-sm ${page === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-yellow-600 hover:text-yellow-700 dark:text-yellow-500 dark:hover:text-yellow-400'}`}
        onClick={() => page !== 1 && onPageChange(page - 1)}
      >
        &lt;
      </span>
      {Array.from({ length: totalPages }).map((_, i) => {
        const p = i + 1
        if (p === 1 || p === totalPages || (p >= page - 1 && p <= page + 1 && totalPages > 4) || totalPages <= 7) {
          return (
            <span 
              key={p}
              className={`px-2 py-1 text-sm cursor-pointer ${p === page 
                ? 'font-bold border border-yellow-500 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' 
                : 'hover:text-yellow-700 dark:hover:text-yellow-400'}`}
              onClick={() => onPageChange(p)}
            >
              {p}
            </span>
          )
        }
        if ((p === page - 2 && p > 1 && p < totalPages - 1) || (p === page + 2 && p < totalPages && p > 2)) {
          return (
            <span key={p} className="px-1 text-yellow-500">
              <MoreHorizontal className="h-4 w-4" />
            </span>
          )
        }
        return null
      })}
      <span 
        className={`cursor-pointer px-2 py-1 text-sm ${page === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-yellow-600 hover:text-yellow-700 dark:text-yellow-500 dark:hover:text-yellow-400'}`}
        onClick={() => page !== totalPages && onPageChange(page + 1)}
      >
        &gt;
      </span>
      <span className="text-yellow-600/70 dark:text-yellow-500/70 ml-2 text-xs">
        {recordsText} {total}
      </span>
    </div>
  )
}

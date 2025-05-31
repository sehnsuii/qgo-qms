import SecondaryButton from '@/Components/SecondaryButton';
import { MdFirstPage, MdLastPage, MdNavigateBefore, MdNavigateNext } from 'react-icons/md';

export default function QueueTablePagination({ gotoPage, previousPage, nextPage, canPreviousPage, canNextPage, pageCount, pageIndex, pageOptions, pageSize, setPageSize }) {
  return (
    <div className='mt-4 flex items-center justify-between'>
      <div className='flex items-center space-x-2'>
        <SecondaryButton
          onClick={() => gotoPage(0)}
          disabled={!canPreviousPage}
        >
          <MdFirstPage />
        </SecondaryButton>
        <SecondaryButton
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
        >
          <MdNavigateBefore />
        </SecondaryButton>
        <SecondaryButton
          onClick={() => nextPage()}
          disabled={!canNextPage}
        >
          <MdNavigateNext />
        </SecondaryButton>
        <SecondaryButton
          onClick={() => gotoPage(pageCount - 1)}
          disabled={!canNextPage}
        >
          <MdLastPage />
        </SecondaryButton>
      </div>
      <span>
        Page{' '}
        <strong>
          {pageIndex + 1} of {pageOptions.length}
        </strong>{' '}
      </span>
      <select
        value={pageSize}
        onChange={(e) => {
          setPageSize(Number(e.target.value));
        }}
        className='rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
      >
        {[10, 20, 30, 40, 50].map((pageSizeOption) => (
          <option
            key={pageSizeOption}
            value={pageSizeOption}
          >
            Show {pageSizeOption}
          </option>
        ))}
      </select>
    </div>
  );
}

import PaginationType from "../types/PaginationType";

interface PaginationProps {
    pagination: PaginationType;
    onPageChange: (pageNumber: number) => void;
}

const Pagination = ({pagination, onPageChange}: PaginationProps) => {
    const { currentPage, totalPages, totalRows } = pagination;

    const pageButtons = Array.from({ length: totalPages }, (_, index) => {
        const pageNumber = index + 1;
        return (
            <li key={pageNumber}>
                <button
                    className={`${
                        (currentPage + 1) === pageNumber
                            ? 'px-3 py-1 text-white transition-colors duration-150 bg-purple-600 border border-r-0 border-purple-600 rounded-md focus:outline-none focus:shadow-outline-purple'
                            : 'px-3 py-1 rounded-md focus:outline-none focus:shadow-outline-purple'
                    }`}
                    onClick={() => onPageChange(pageNumber - 1)}
                >
                    {pageNumber}
                </button>
            </li>
        );
    });

    return (
        
        <div className="grid px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:border-gray-700 bg-gray-50 sm:grid-cols-9 dark:text-gray-400 dark:bg-gray-800">
            
            {(totalRows > 0) ?
            (<><span className="flex items-center col-span-3">
                    Showing {currentPage === 0 ? 1 : currentPage * 10 + 1} - {Math.min((currentPage + 1) * 10, totalRows)} of {totalRows}
                </span><span className="col-span-2"></span><span className="flex col-span-4 mt-2 sm:mt-auto sm:justify-end">
                        <nav aria-label="Table navigation">
                            <ul className="inline-flex items-center">
                                <li>
                                    <button
                                        className="px-3 py-1 rounded-md rounded-l-lg focus:outline-none focus:shadow-outline-purple"
                                        aria-label="Previous"
                                        onClick={() => onPageChange(currentPage == 1 ? 0 : Math.max(currentPage - 1, 1))}
                                        disabled={(currentPage + 1) === 1}
                                    >
                                        <svg
                                            className="w-4 h-4 fill-current"
                                            aria-hidden="true"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                            ></path>
                                        </svg>
                                    </button>
                                </li>
                                {pageButtons}
                                <li>
                                    <button
                                        className="px-3 py-1 rounded-md rounded-r-lg focus:outline-none focus:shadow-outline-purple"
                                        aria-label="Next"
                                        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
                                        disabled={(currentPage + 1) === totalPages}
                                    >
                                        <svg
                                            className="w-4 h-4 fill-current"
                                            aria-hidden="true"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                            ></path>
                                        </svg>
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </span></>)
            :
            (<><span className="flex items-center col-span-3">
                No data found
            </span></>
            )}
        </div>
    );
};

export default Pagination;

import PaginationType from "../../types/PaginationType";
import StockType from "../../types/stock/StockType";
import Pagination from "../Pagination";

interface StockTableProps {
    stocks: StockType[];
    pagination: PaginationType;
    onHandlePageChange: (pageNumber: number) => void;
    onEditStock: (id?: number) => void;
    onDeleteStock: (id?: number) => void;
}

const StockTable = ({ stocks=[], pagination, onHandlePageChange, onEditStock, onDeleteStock }: StockTableProps) => {

    return (
        <>
            <div className="w-full overflow-x-auto animate-fade-in-bottom">
                <table className="w-full whitespace-no-wrap shadow-xl">
                    <thead>
                        <tr
                        className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b bg-purple-100"
                        >
                        <th className="px-4 py-3 text-center">NAME</th>
                        <th className="px-4 py-3 text-center">DESCRIPTION</th>
                        <th className="px-4 py-3 text-center">Amount</th>
                        <th className="px-4 py-3 text-center">CATEGORY</th>
                        <th className="px-4 py-3 text-center">Quantity</th>
                        <th className="px-4 py-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody
                        className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800"
                    >
                    {stocks.map((stock) => (
                        <tr key={stock.id} className="text-gray-700 dark:text-gray-400">
                            <td className="px-4 py-3">
                                <span className="text-base text-left text-gray-600 dark:text-gray-400">
                                   {stock.item?.name} 
                                </span>
                            </td>
                            <td className="px-4 py-3">
                                <span className="text-base text-left text-gray-600 dark:text-gray-400">
                                    {stock.item?.description} 
                                </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                                <span className="text-base text-gray-600 dark:text-gray-400">
                                    {stock.item?.price}  
                                </span>
                            </td>
                            <td className="px-4 py-3">
                                <span className="text-base text-center text-gray-600 dark:text-gray-400">
                                    {stock.category?.name} 
                                </span>
                            </td>
                            <td className="px-4 py-3">
                                <span className="text-base text-center text-gray-600 dark:text-gray-400">
                                    {stock.quantity} 
                                </span>
                            </td>
                            <td className="relative">
                                <div className="flex justify-center space-x-1 text-sm">
                                    <button
                                        className="px-1 py-1 text-sm font-medium leading-5 text-purple-500 hover:text-purple-800 rounded-lg focus:outline-none focus:shadow-outline-gray"
                                        aria-label="Edit"
                                        onClick={() => onEditStock(stock.id) }
                                    >
                                        <svg
                                        className="w-5 h-5"
                                        aria-hidden="true"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="1.5" 
                                        >
                                            <path d="M18 10L14 6M18 10L21 7L17 3L14 6M18 10L17 11M14 6L8 12V16H12L14.5 13.5M20 14V20H12M10 4L4 4L4 20H7" />
                                        </svg>
                                    </button>
                                    <button
                                        className="px-1 py-1 text-sm font-medium leading-5 text-purple-500 hover:text-purple-800 rounded-lg focus:outline-none focus:shadow-outline-gray"
                                        aria-label="Delete"
                                        onClick={() => onDeleteStock(stock.id) }
                                    >
                                        <svg
                                        className="w-5 h-5"
                                        aria-hidden="true"
                                        fill="currentColor"
                                        viewBox="0 0 1024 1024"
                                        >
                                            <path d="M960 160h-291.2a160 160 0 0 0-313.6 0H64a32 32 0 0 0 0 64h896a32 32 0 0 0 0-64zM512 96a96 96 0 0 1 90.24 64h-180.48A96 96 0 0 1 512 96zM844.16 290.56a32 32 0 0 0-34.88 6.72A32 32 0 0 0 800 320a32 32 0 1 0 64 0 33.6 33.6 0 0 0-9.28-22.72 32 32 0 0 0-10.56-6.72zM832 416a32 32 0 0 0-32 32v96a32 32 0 0 0 64 0v-96a32 32 0 0 0-32-32zM832 640a32 32 0 0 0-32 32v224a32 32 0 0 1-32 32H256a32 32 0 0 1-32-32V320a32 32 0 0 0-64 0v576a96 96 0 0 0 96 96h512a96 96 0 0 0 96-96v-224a32 32 0 0 0-32-32z"/>
                                            <path d="M384 768V352a32 32 0 0 0-64 0v416a32 32 0 0 0 64 0zM544 768V352a32 32 0 0 0-64 0v416a32 32 0 0 0 64 0zM704 768V352a32 32 0 0 0-64 0v416a32 32 0 0 0 64 0z"/>
                                        </svg>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <div className="w-full animate-fade-in-bottom">
                <Pagination 
                pagination={pagination} 
                onPageChange={onHandlePageChange} />
            </div>
        </>
    )
}

export default StockTable;
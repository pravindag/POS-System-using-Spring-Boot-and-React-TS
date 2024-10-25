import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import LeftSidebar from "../../layout/LeftSidebar";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import LoadingGif from "../../components/LoadingGif";
import PaginationType from "../../types/PaginationType";
import Modal from "../../components/Modal";
import VerticalCategoryList from "../../components/category/VerticalCategoryList";
import StockTable from "../../components/stock/StockTable";
import StockType from "../../types/stock/StockType";
import StockForm from "../../components/stock/StockForm";

const Stock = () => {

    const { isAuthenticated, jwtToken } = useAuth();
    const [isPageLoaded, setIsPageLoaded] = useState<boolean>(false);
    const [categoryId, setCategoryId] = useState<number>(0);
    const [stocks, setStocks] = useState<StockType[]>([]);
    const [stockUpdateId, setStockUpdateId] = useState<number | undefined>(0);

    const [isModalOpen, setModalOpen] = useState(false);
    const [showMessage, setShowMessage] = useState({
        title: '',
        message: '',
        type: ''
    });
    const openModal = () => {
        setModalOpen(true);
    }; 
    const closeModal = () => {
        setModalOpen(false);
        setShowMessage({
            title: '',
            message: '',
            type: ''
        });
    };

    const [pagination, setPagination] = useState<PaginationType>({
        totalRows: 0,
        currentPage: 0,
        totalPages: 0,
        rowsPerPage: 10
    });

    if(!isAuthenticated) {
        return (
            <Navigate to="/auth/login" />
        )
    }

    const config = {
        headers: {
            Authorization: `Bearer ${jwtToken}`
        }
    }

    useEffect(() => {
        const handleWindowLoad = () => {
          setIsPageLoaded(true);
        };
    
        if (document.readyState === 'complete') {
            handleWindowLoad();
        } else {
            window.addEventListener("load", handleWindowLoad);
        } 

        return () => {
            window.removeEventListener("load", handleWindowLoad);
            loadStocks(0, pagination.rowsPerPage);
        }
    }, []);

    useEffect(() => {
        loadStocks(0, pagination.rowsPerPage);
    }, [categoryId]);
    
    if (!isPageLoaded) {
        return <LoadingGif />;
    }

    const handleCategorySelect = (newCategoryId: number) => {
        setCategoryId(newCategoryId);
    };

    async function loadStocks(page: number, size: number) {
        try {
            await axios.get("http://localhost:8080/stocks", {
                params: {
                    categoryId: categoryId,
                    page: page,
                    size: size
                },
                headers: {
                    ...config.headers
                }
            })
            .then(response => {
                setStocks(response.data.stocks); 
                setPagination({
                    totalRows: response.data.totalStocks,
                    currentPage: response.data.currentPage,
                    totalPages: response.data.totalPages,
                    rowsPerPage: pagination.rowsPerPage
                });
            })
            .catch(error => { 
                openModal();
                setShowMessage({
                    title: 'Error',
                    message: error,
                    type: 'error'
                });
            });
        } catch (error) {
            openModal();
            setShowMessage({
                title: 'Error',
                message: 'There is an error in getting Items!',
                type: 'error'
            });
        }
    }

    const handlePageChange = (pageNumber: number) => {
        loadStocks(pageNumber, pagination.rowsPerPage);
    }

    const onLoadStocks = () => {
        loadStocks(0, pagination.rowsPerPage);
    }

    const handleStockEdit = async (stockId?: number) => {
        setStockUpdateId(stockId);
    }

    const handleStockDelete = async (stockId?: number) => { 
        try {
            await axios.delete(`http://localhost:8080/stock/${stockId}`, config)
            .then(response => { 
                openModal();
                setShowMessage({
                    title: 'Success',
                    message: response.data,
                    type: 'success'
                });
                loadStocks(0, pagination.rowsPerPage);
            })
            .catch(error => { 
                openModal();
                setShowMessage({
                    title: 'Error',
                    message: error.response.data,
                    type: 'error'
                });
            });
            
        } catch (error) {
            openModal();
            setShowMessage({
                title: 'Error',
                message: 'There is an error in getting Item!',
                type: 'error'
            });
        }
    }

    return (
        <div className="flex w-full h-screen bg-gray-50 dark:bg-gray-900">
            <LeftSidebar />
            
            <div className="py-10 flex flex-col flex-1 w-full">
                           
                <main className="h-full overflow-y-auto">
                    <div className="container px-8 mx-auto flex">

                        <div className="justify-between w-40">
                            <VerticalCategoryList 
                                onSelectCategory={handleCategorySelect} />
                        </div>

                        <div className="justify-between w-[700px] overflow-hidden bg-white rounded-lg shadow-lg">
                            <StockTable
                                stocks={stocks}
                                pagination={pagination}
                                onHandlePageChange={handlePageChange}
                                onEditStock={handleStockEdit}
                                onDeleteStock={handleStockDelete} />
                        </div>
                        
                    </div>
                </main>
            </div>
            
            <aside className="z-20 hidden w-96 overflow-y-auto bg-gray-50 md:block flex-shrink-0 ml-auto py-10 px-5">
                <div className="w-80 h-[440px] overflow-hidden bg-white rounded-lg shadow-lg">

                    <StockForm 
                        onLoadStocks={onLoadStocks}
                        stockUpdateId={stockUpdateId}
                        onSetStockUpdateId={setStockUpdateId} />

                    <div
                    className="relative px-8 mt-36"
                    >
                        <Link
                            to='/user/dashboard'
                            className='text-sm font-semibold transition-colors duration-150 px-8 py-3 bg-purple-500 hover:bg-purple-700 rounded-xl shadow-xl focus:shadow-outline-purple focus:outline-none text-white cursor-pointer'
                            aria-label="Submit"
                        >
                            Place Order
                        </Link>
                    </div>
                </div>
            </aside>

            <Modal 
                show={isModalOpen} 
                onClose={closeModal} 
                showMessage={showMessage}
            />

        </div>
    )
}

export default Stock;
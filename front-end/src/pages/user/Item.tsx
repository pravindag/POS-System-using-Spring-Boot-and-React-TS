import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import LeftSidebar from "../../layout/LeftSidebar";
import ItemType from "../../types/item/ItemType";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import LoadingGif from "../../components/LoadingGif";
import PaginationType from "../../types/PaginationType";
import Modal from "../../components/Modal";
import ItemTable from "../../components/item/ItemTable";
import ItemForm from "../../components/item/ItemForm";

const Item = () => {

    const { isAuthenticated, jwtToken } = useAuth();
    const [isPageLoaded, setIsPageLoaded] = useState<boolean>(false);
    const [items, setItems] = useState<ItemType[]>([]);
    const [itemUpdateId, setItemUpdateId] = useState<number | undefined>(0);
    const [pagination, setPagination] = useState<PaginationType>({
        totalRows: 0,
        currentPage: 0,
        totalPages: 0,
        rowsPerPage: 10
    });

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
            loadItems(0, pagination.rowsPerPage);
        }
    }, []);
    
    if (!isPageLoaded) {
        return <LoadingGif />;
    }

    async function loadItems(page: number, size: number) {
        try {
            await axios.get("http://localhost:8080/items-with-images", {
                params: {
                    page: page,
                    size: size
                },
                headers: {
                    ...config.headers
                }
            })
            .then(response => {
                setItems(response.data.items);
                setPagination({
                    totalRows: response.data.totalItems,
                    currentPage: response.data.currentPage,
                    totalPages: response.data.totalPages,
                    rowsPerPage: pagination.rowsPerPage
                })
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
        loadItems(pageNumber, pagination.rowsPerPage);
    }

    const onLoadItems = () => {
        loadItems(0, pagination.rowsPerPage);
    }

    const handleItemEdit = async (itemId?: number) => {
        setItemUpdateId(itemId);
    }

    const handleItemDelete = async (itemId?: number) => {
        
        try{
            await axios.delete(`http://localhost:8080/item/${itemId}`, {
                headers: {
                    ...config.headers
                }
            })
            .then(response => {
                loadItems(0, 10);
                openModal();
                setShowMessage({
                    title: 'Success',
                    message: response.data,
                    type: 'success'
                });
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
                message: 'There is an error in deleting Item!',
                type: 'error'
            });
        }

    }

    return (
        <div className="flex w-full h-screen bg-gray-50 dark:bg-gray-900">
            <LeftSidebar />
            
            <div className="py-10 flex flex-col flex-1 w-full">
                           
                <main className="h-full overflow-y-auto">
                    <div className="container px-8 mx-auto grid">

                        <div className="w-full overflow-hidden bg-white rounded-lg shadow-lg">
                            <ItemTable
                                items={items}
                                pagination={pagination}
                                onHandlePageChange={handlePageChange}
                                onEditItem={handleItemEdit}
                                onDeleteItem={handleItemDelete} />
                        </div>
                    </div>
                </main>
            </div>
            
            <aside className="z-20 hidden w-96 overflow-y-auto bg-gray-50 md:block flex-shrink-0 ml-auto py-12 px-5">
                <div className="w-80 h-[630px] overflow-hidden bg-white rounded-lg shadow-lg">
    
                    <ItemForm 
                        itemUpdateId={itemUpdateId}
                        onLoadItems={onLoadItems}
                        onSetItemUpdateId={setItemUpdateId} />

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

export default Item;
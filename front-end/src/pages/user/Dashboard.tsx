import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import LoadingGif from "../../components/LoadingGif";
import LeftSidebar from "../../layout/LeftSidebar";
import Header from "../../layout/Header";
import axios from "axios";
import CategoryType from "../../types/category/CategoryType";
import { Navigate } from "react-router-dom";
import HorizontalCategoryList from "../../components/category/HorizontalCategoryList";
import ItemType from "../../types/item/ItemType";
import PaginationType from "../../types/PaginationType";
import Pagination from "../../components/Pagination";
import Order from "../../components/order/Order";
import Modal from "../../components/Modal";

const Dashboard = () => {
    
    const { isAuthenticated, jwtToken } = useAuth();
    const [isPageLoaded, setIsPageLoaded] = useState<boolean>(false);
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [categoryId, setCategoryId] = useState<number>(0);
    const [items, setItems] = useState<ItemType[]>([]);
    const [activeItems, setActiveItems] = useState<Map<number, number>>(new Map());
    const [orders, setOrders] = useState<ItemType[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [pagination, setPagination] = useState<PaginationType>({
        totalRows: 0,
        currentPage: 0,
        totalPages: 0,
        rowsPerPage: 8
    });
    const [activeTab, setActiveTab] = useState<string>('tab1');

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
            loadCategories();
        }
    }, []);

    useEffect(() => {
        loadItems(0, pagination.rowsPerPage);
    }, [categoryId]);
    
    if (!isPageLoaded) {
        return <LoadingGif />;
    }

    async function loadItems(page: number, size: number) {
        try {
            await axios.get("http://localhost:8080/items-with-images", {
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
                setItems(response.data.items);
                setPagination({
                    totalRows: response.data.totalItems,
                    currentPage: response.data.currentPage,
                    totalPages: response.data.totalPages,
                    rowsPerPage: pagination.rowsPerPage
                });
            })
            .catch(error => {
                openModal();
                setShowMessage({
                    title: 'Error',
                    message: error.response.data.error,
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

    async function loadCategories() {
        try {
            await axios.get("http://localhost:8080/categories-with-items-count", config)
            .then(response => {
                setCategories(response.data);
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
                message: 'There is an error in getting Categories!',
                type: 'error'
            });
        }
    }

    const handleCategorySelect = (newCategoryId: number) => {
        setCategoryId(newCategoryId);
    };

    const handlePageChange = (pageNumber: number) => {
        loadItems(pageNumber, pagination.rowsPerPage);
    }

    const handleAddToDish = (item: ItemType) => {
        setOrders((prevOrders) => [...prevOrders, { ...item, quantity: 1 }]);
        setTotal((prevTotal) => prevTotal + item.price);

        setActiveItems((prevActiveItems) => {
            const newActiveItems = new Map(prevActiveItems);
            const currentQuantity = newActiveItems.get(item.id ?? 0) ?? 0;
            newActiveItems.set(item.id ?? 0, currentQuantity + 1);
            return newActiveItems;
        });
    }; 
    
    const increaseQuantity = (item: ItemType) => {
        const existingItem = orders.find(op => op.id === item.id);

        if (existingItem) {
            setOrders((prevOrders) =>
                prevOrders.map(orderItem =>
                    orderItem.id === item.id
                        ? { ...orderItem, quantity: orderItem.quantity + 1 }
                        : orderItem
                )
            );
            setTotal(total + item.price);

            setActiveItems((prevActiveItems) => {
                const newActiveItems = new Map(prevActiveItems);
                const currentQuantity = newActiveItems.get(item.id ?? 0) ?? 0;
                newActiveItems.set(item.id ?? 0, currentQuantity + 1);
                return newActiveItems;
            });
        } 
    }

    const decreaseQuantity = (item: ItemType) => {
        const existingItem = orders.find(op => op.id === item.id);
        
        if (existingItem && (existingItem.quantity) > 1) {
            setOrders(orders.map(op =>
                op.id === item.id ? { ...op, quantity: op.quantity - 1 } : op
            ));
            setTotal(total - item.price);

            setActiveItems((prevActiveItems) => {
                const newActiveItems = new Map(prevActiveItems);
                const currentQuantity = newActiveItems.get(item.id ?? 0) ?? 0;
                newActiveItems.set(item.id ?? 0, currentQuantity - 1);
                return newActiveItems;
            });
        }
    }

    const handleTabClick = (tabId: string) => {
        setActiveTab(tabId);
        setOrders([]);
        setTotal(0);
        setActiveItems(new Map())
    };

    const removeOrderItem = (item: ItemType) => {
        setOrders(orders.filter(op => op.id !== item.id));
        setTotal((prevTotal) => prevTotal - (item.price * item.quantity));

        setActiveItems((prevActiveItems) => {
            const newActiveItems = new Map(prevActiveItems);
            newActiveItems.delete(item.id??0);
            return newActiveItems;
        });
    }

    const handleOrder = async (e: React.FormEvent) => {
        e.preventDefault();

        if (orders.length === 0) {
            openModal();
            setShowMessage({
                title: 'Error',
                message: 'No items in the order!',
                type: 'error'
            });
            return;
        }

        const orderDetails: any = [];

        orders.map(function (order) {
            orderDetails.push({"itemId": order.id, "quantity": order.quantity});
        });

        try {
            await axios.post("http://localhost:8080/order", {
                orderDetails: orderDetails,
                userId: 1
            }, {
                headers: {
                    ...config.headers
                }
            })
            .then(response => {
                openModal();
                setShowMessage({
                    title: 'Success',
                    message: response.data,
                    type: 'success'
                });
                setOrders([]);
                setTotal(0);
                setActiveItems(new Map());
                loadItems(0, pagination.rowsPerPage);
            })
            .catch(error => {  console.log(error)
                openModal();
                setShowMessage({
                    title: 'Error',
                    message: error.response.data,
                    type: 'error'
                });
            });
        } catch (error: any) {
            openModal();
            setShowMessage({
                title: 'Error',
                message: 'There is an error in creating Order!',
                type: 'error'
            });
        }
    }

    return (
        <div className="flex w-full h-screen bg-gray-50 dark:bg-gray-900">
            <LeftSidebar />
            
            <div className="flex flex-col flex-1 w-full">
                
                <Header />
                
                <main className="h-full overflow-y-auto">
                    <div className="container px-6 mx-auto grid">
                        <HorizontalCategoryList categories={categories} onSelectCategory={handleCategorySelect} />
                    </div>

                    <div>
                        <div
                        className='ml-12 py-2 w-[840px] grid grid-cols-4 gap-3'
                        >
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className={`mr-5 mt-2 px-2 py-2 justify-start w-48 h-72 text-slate-600 border bg-purple-50 hover:border-purple-600 hover:border-2 rounded-xl shadow-lg inline-block cursor-pointer animate-fade-in-bottom 
                                    ${activeItems.has(item.id ?? 0) ? 'border-purple-600 border-2' : ''}`}
                                >
                                    <div
                                    className="relative hidden m-2 rounded-xl md:block"
                                    >
                                        <img
                                        className="object-cover w-40 h-36 rounded-xl"
                                        src={"http://localhost:8080/" + item.imagePath}
                                        alt="Item Image"
                                        loading="lazy"
                                        />
                                        <div
                                        className="absolute inset-0 rounded-full shadow-inner"
                                        aria-hidden="true"
                                        ></div>
                                    </div>
                                    <div className="ml-2 pt-1 text-left">
                                        <span className="text-sm font-semibold">{item.name}</span>
                                    </div>
                                    <div className="ml-2 pt-1 flex justify-between">
                                        <span className="text-xs font-semibold text-fuchsia-500">Rs. {Intl.NumberFormat("en-US", {maximumFractionDigits: 2}).format(item.price)}.00</span>
                                        {item.category?.id === 8 && item.stockQuantity != null && item.stockQuantity > 0 ?
                                        (<span className="pr-3 text-xs font-semibold text-green-500">QoH : {item.stockQuantity}</span>)
                                        : ''}
                                    </div>
                                    <div className="ml-2 mr-2 pt-4 flex">
                                        { activeItems.has(item.id ?? 0) ?
                                        (<div 
                                        className='flex justify-center text-sm font-semibold transition-colors duration-150 w-40 h-8 px-1 py-1 bg-purple-300 rounded-lg shadow-xl focus:shadow-outline-purple focus:outline-none text-purple-600 cursor-default'
                                        >
                                            <div className="mr-6 flex text-left">
                                                <svg 
                                                    className="w-6 h-6 text-purple-500 hover:cursor-pointer hover:text-purple-800"
                                                    strokeLinecap="round" 
                                                    strokeLinejoin="round" 
                                                    viewBox="0 0 24 24"
                                                    fill="currentColor" 
                                                    stroke="text-white"
                                                    onClick={() => decreaseQuantity(item)}>
                                                        <path fillRule="evenodd" clipRule="evenodd" d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM15.75 12C15.75 12.4142 15.4142 12.75 15 12.75H9C8.58579 12.75 8.25 12.4142 8.25 12C8.25 11.5858 8.58579 11.25 9 11.25H15C15.4142 11.25 15.75 11.5858 15.75 12Z"/> </svg>
                                            </div>
                                            <div className="flex">
                                                <span className="text-slate-600 text-center text-base font-semibold">{activeItems.get(item.id ?? 0)}</span>
                                            </div>
                                            <div className="ml-6 flex text-right">
                                                <svg 
                                                    className="w-6 h-6 text-purple-500 hover:cursor-pointer hover:text-purple-800"
                                                    strokeLinecap="round" 
                                                    strokeLinejoin="round" 
                                                    viewBox="0 0 24 24"
                                                    fill="currentColor" 
                                                    stroke="text-white"
                                                    onClick={() => increaseQuantity(item)}>
                                                        <path d="M13 9C13 8.44772 12.5523 8 12 8C11.4477 8 11 8.44772 11 9V11H9C8.44772 11 8 11.4477 8 12C8 12.5523 8.44772 13 9 13H11V15C11 15.5523 11.4477 16 12 16C12.5523 16 13 15.5523 13 15V13H15C15.5523 13 16 12.5523 16 12C16 11.4477 15.5523 11 15 11H13V9ZM2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12Z"/>
                                                </svg>
                                            </div>
                                        </div>
                                        
                                        )
                                        : (
                                            item.category?.id === 8 && item.stockQuantity != null && item.stockQuantity === 0 
                                            ? 
                                            <span className="text-sm font-semibold text-red-500">Out of Stock</span> 
                                            : 
                                            <button 
                                                className={`text-sm font-semibold transition-colors duration-150 w-40 h-7 px-1 py-1 bg-purple-300 rounded-lg shadow-xl focus:shadow-outline-purple focus:outline-none text-purple-600 ${activeItems.has(item.id ?? 0) ? 'cursor-default' : 'cursor-pointer'}`}
                                                aria-label="Submit"
                                                onClick={() => handleAddToDish(item)}
                                            >
                                                Add to Dish
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <Pagination 
                            pagination={pagination} 
                            onPageChange={handlePageChange} />
                </main>
            </div>
            
            <aside className="z-20 hidden w-96 overflow-y-auto bg-gray-50 md:block flex-shrink-0 ml-auto py-5 px-5">
                <div className="w-85 h-[680px] overflow-hidden bg-white rounded-lg shadow-lg">
                    <div className="flex m-5 bg-purple-200 rounded-lg" data-tabs="true">
                        <a
                        className={`rounded-lg w-24 py-2 px-4 cursor-pointer ${
                            activeTab === 'tab1' ? 'active bg-purple-400 text-white' : 'bg-purple-200 text-gray-400 hover:bg-purple-400 hover:text-white'
                        }`}
                        onClick={() => handleTabClick('tab1')}
                        >
                        <i className="ki-outline ki-badge"></i>
                            Dine In
                        </a>
                        <a
                        className={`rounded-lg w-28 py-2 px-4 cursor-pointer ${
                            activeTab === 'tab2' ? 'active bg-purple-400 text-white' : 'bg-purple-200 text-gray-400 hover:bg-purple-400 hover:text-white'
                        }`}
                        onClick={() => handleTabClick('tab2')}
                        >
                        <i className="ki-outline ki-user-square"></i>
                            Take Away
                        </a>
                        <a
                        className={`rounded-lg w-24 py-2 px-4 cursor-pointer ${
                            activeTab === 'tab3' ? 'active bg-purple-400 text-white' : 'bg-purple-200 text-gray-400 hover:bg-purple-400 hover:text-white'
                        }`}
                        onClick={() => handleTabClick('tab3')}
                        >
                        <i className="ki-outline ki-calendar"></i>
                            Delivery
                        </a>
                    </div>

                    {/* Tab Content */}
                    {activeTab === 'tab1' && (
                        <div 
                        id="tab_1"
                        className="m-3 w-[319px] h-[400px] bg-purple-100 rounded-lg overflow-y-auto" >
                            <Order orders={orders} removeOrderItem={removeOrderItem} />
                        </div>
                    )}

                    {activeTab === 'tab2' && (
                        <div id="tab_2"
                        className="m-3 w-[319px] h-[400px] bg-purple-100 rounded-lg overflow-y-auto" >
                            <Order orders={orders} removeOrderItem={removeOrderItem} />
                        </div>
                    )}

                    {activeTab === 'tab3' && (
                        <div id="tab_3"
                        className="m-3 w-[319px] h-[400px] bg-purple-100 rounded-lg overflow-y-auto" >
                            <Order orders={orders} removeOrderItem={removeOrderItem} />
                        </div>
                    )}

                    <div className="ml-7 w-72 bg-purple-200 rounded-lg">
                        <div className="grid grid-cols-2 pl-10 pr-10 pt-2">
                            <span className="text-xs font-semibold text-gray-600 text-left">
                                Sub Total
                            </span>
                            <span className="text-xs font-semibold text-gray-600 text-right">
                                Rs. {Intl.NumberFormat("en-US", {maximumFractionDigits: 2}).format(total)}.00
                            </span>
                        </div>
                        <div className="grid grid-cols-2 pl-10 pr-10 pt-1">
                            <span className="text-xs font-semibold text-gray-600 text-left">
                                Tax 10%
                            </span>
                            <span className="text-xs font-semibold text-gray-600 text-right">
                                Rs. {Intl.NumberFormat("en-US", {maximumFractionDigits: 2}).format((total * 10)/100)}.00
                            </span>
                        </div>
                        <div className="pl-10 pr-10 pt-0">
                            <span className="text-gray-500">..............................................</span>
                        </div>
                        <div className="grid grid-cols-2 pl-10 pr-10 pt-1 pb-2">
                            <span className="text-sm font-semibold text-gray-800 text-left">
                                Total Amount
                            </span>
                            <span className="text-sm font-semibold text-gray-800 text-right">
                                Rs. {Intl.NumberFormat("en-US", {maximumFractionDigits: 2}).format(total + ((total * 10)/100))}.00
                            </span>
                        </div>
                    </div>
                    <div
                    className="mt-5"
                    >
                        <button
                            className='text-sm font-semibold transition-colors duration-150 px-8 py-3 bg-purple-400 hover:bg-purple-600 rounded-xl shadow-xl focus:shadow-outline-purple focus:outline-none text-white cursor-pointer'
                            aria-label="Submit"
                            onClick={handleOrder}
                        >
                            Place Order
                        </button>
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

export default Dashboard;
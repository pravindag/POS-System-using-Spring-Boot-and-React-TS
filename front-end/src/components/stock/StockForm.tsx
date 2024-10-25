import { useEffect, useState } from "react";
import StockType from "../../types/stock/StockType";
import axios from "axios";
import ItemType from "../../types/item/ItemType";
import { useAuth } from "../../context/AuthContext";
import CategoryType from "../../types/category/CategoryType";
import Modal from "../Modal";

interface StockFormProps {
    stockUpdateId: number | undefined;
    onLoadStocks: () => void;
    onSetStockUpdateId: (stockId: number) => void;
}

const StockForm = ({ stockUpdateId, onLoadStocks, onSetStockUpdateId }: StockFormProps) => {

    const { jwtToken } = useAuth();
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
    
    const [isStockUpdate, setStockUpdate] = useState<boolean>(false);
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [items, setItems] = useState<ItemType[]>([]);
    const [formData, setFormData] = useState<StockType>({
        id: 0,
        categoryId: 0,
        itemId: 0,
        quantity: 0
    });

    const config = {
        headers: {
            Authorization: `Bearer ${jwtToken}`
        }
    }

    useEffect(() => {
        loadCategories();
    }, []);

    async function loadCategories() {
        try {
            await axios.get("http://localhost:8080/categories", config)
            .then(response => {
                setCategories(response.data); 
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
                message: 'There is an error in getting Categories!',
                type: 'error'
            });
        }
    }
    
    const onHandleItem = (e: React.ChangeEvent<HTMLSelectElement>) => { 
        loadItems(parseInt(e.target.value));
    }

    const loadItems = async (categoryId?: number) => { 
        try {
            await axios.get(`http://localhost:8080/items/${categoryId}`, config)
            .then(response => {
                setItems(response.data); 
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
                message: 'There is an error in getting Categories!',
                type: 'error'
            });
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => { 
        e.preventDefault();

        try {
            await axios.post("http://localhost:8080/stock", formData, {
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
                onLoadStocks();
                clearFormData();
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
                message: 'There is an error in submitting Stock!',
                type: 'error'
            });
        }
    }

    useEffect(() => {
        if (stockUpdateId != null && stockUpdateId > 0) {
            handleStockEdit(stockUpdateId);
        }
    }, [stockUpdateId]);

    const handleStockEdit = async (stockId?: number) => {
        if(stockId!=0 && stockId!=undefined){
            try {
                await axios.get(`http://localhost:8080/stock/${stockId}`, config)
                .then(response => { 
                    setFormData(response.data);
                    setFormData((prevData) => ({ 
                        ...prevData,
                        itemId: response.data.item.id,
                        categoryId: response.data.category.id,
                    }));
                    loadItems(response.data.category.id);
                    setStockUpdate(true);
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
    }

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await axios.put(`http://localhost:8080/stock/${formData.id}`, formData, {
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
                onLoadStocks();
                setStockUpdate(false);
                clearFormData();
                onSetStockUpdateId(0);
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
                message: 'There is an error in updating Stock!',
                type: 'error'
            });
        }
    }

    const clearFormData = () => {
        setFormData({
            id: 0,
            categoryId: 0,
            category: { id: 0, name: '', description: '' },
            itemId: 0,
            item: { id: 0, name: '', description: '', price: 0, categoryId: 0, image: null, quantity: 0 },
            quantity: 0
        });
    }

    return (
        <>
            <form onSubmit={isStockUpdate ? handleUpdate : handleSubmit}>
                <div
                    className="relative text-gray-500 focus-within:text-purple-600 dark:focus-within:text-purple-400 px-8 mt-5"
                >
                    <select
                        name="categoryId"
                        value={formData.category?.id}
                        onChange={(e) => {
                            handleChange(e);
                            isStockUpdate ? '' : onHandleItem(e);
                        } }
                        className={`block w-64 h-10 pl-10 pr-20 mt-1 text-sm bg-purple-100 text-gray-500 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input rounded-xl
                                    ${isStockUpdate ? 'select-none' : ''}  
                                  `}
                    >
                        <option value="0">Select Category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                    </select>
                    <div
                        className="absolute inset-y-0 flex items-center ml-3 pointer-events-none"
                    >
                        <svg
                            className="w-5 h-5"
                            aria-hidden="true"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path d="M3.75 5.5a.75.75 0 000 1.5h10a.75.75 0 000-1.5h-10zm5 6a.75.75 0 000 1.5h11.5a.75.75 0 000-1.5H8.75zm0 6a.75.75 0 000 1.5h11.5a.75.75 0 000-1.5H8.75zM5 12a1 1 0 11-2 0 1 1 0 012 0zm-1 7a1 1 0 100-2 1 1 0 000 2z" />
                            <path d="M19.309 7.918l-2.245-2.501A.25.25 0 0117.25 5h4.49a.25.25 0 01.185.417l-2.244 2.5a.25.25 0 01-.372 0z" />
                        </svg>
                    </div>

                </div>
                <div
                    className="relative text-gray-500 focus-within:text-purple-600 dark:focus-within:text-purple-400 px-8 mt-5"
                >
                    <select
                        name="itemId"
                        value={formData.item?.id}
                        onChange={handleChange}
                        className={`block w-64 h-10 pl-10 pr-20 mt-1 text-sm bg-purple-100 text-gray-500 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input rounded-xl
                                    ${isStockUpdate ? 'select-none' : ''}  
                                `}
                    >
                        <option value="0">Select Item</option>
                        {items.map((item) => (
                            <option key={item.id} value={item.id}>{item.name}</option>
                        ))}
                    </select>
                    <div
                        className="absolute inset-y-0 flex items-center ml-3 pointer-events-none"
                    >
                        <svg
                            className="w-5 h-5"
                            aria-hidden="true"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path d="M3.75 5.5a.75.75 0 000 1.5h10a.75.75 0 000-1.5h-10zm5 6a.75.75 0 000 1.5h11.5a.75.75 0 000-1.5H8.75zm0 6a.75.75 0 000 1.5h11.5a.75.75 0 000-1.5H8.75zM5 12a1 1 0 11-2 0 1 1 0 012 0zm-1 7a1 1 0 100-2 1 1 0 000 2z" />
                            <path d="M19.309 7.918l-2.245-2.501A.25.25 0 0117.25 5h4.49a.25.25 0 01.185.417l-2.244 2.5a.25.25 0 01-.372 0z" />
                        </svg>
                    </div>

                </div>
                <div
                    className="relative text-gray-500 focus-within:text-purple-600 dark:focus-within:text-purple-400 px-8 mt-5"
                >
                    <input
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        className="block w-64 h-10 pl-10 pr-5 mt-1 text-sm text-right bg-purple-100 text-gray-500 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input rounded-xl"
                        placeholder="Item Name" />
                    <div
                        className="absolute inset-y-0 flex items-center ml-3 pointer-events-none"
                    >
                        <svg
                            className="w-5 h-5"
                            aria-hidden="true"
                            fill="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 54 54"
                            stroke="currentColor"
                        >
                            <path d="M20,37.5c0-0.8-0.7-1.5-1.5-1.5h-15C2.7,36,2,36.7,2,37.5v11C2,49.3,2.7,50,3.5,50h15c0.8,0,1.5-0.7,1.5-1.5 V37.5z" /> <path d="M8.1,22H3.2c-1,0-1.5,0.9-0.9,1.4l8,8.3c0.4,0.3,1,0.3,1.4,0l8-8.3c0.6-0.6,0.1-1.4-0.9-1.4h-4.7 c0-5,4.9-10,9.9-10V6C15,6,8.1,13,8.1,22z" /> <path d="M41.8,20.3c-0.4-0.3-1-0.3-1.4,0l-8,8.3c-0.6,0.6-0.1,1.4,0.9,1.4h4.8c0,6-4.1,10-10.1,10v6 c9,0,16.1-7,16.1-16H49c1,0,1.5-0.9,0.9-1.4L41.8,20.3z" />
                            <path d="M50,3.5C50,2.7,49.3,2,48.5,2h-15C32.7,2,32,2.7,32,3.5v11c0,0.8,0.7,1.5,1.5,1.5h15c0.8,0,1.5-0.7,1.5-1.5 V3.5z" />
                        </svg>
                    </div>
                </div>
                <div
                    className="relative px-8 mt-5"
                >
                    <button
                        className='text-sm font-semibold transition-colors duration-150 w-36 h-10 px-2 py-2 bg-purple-200 hover:bg-purple-600 rounded-xl shadow-xl focus:shadow-outline-purple focus:outline-none text-purple-500 hover:text-white cursor-pointer'
                        aria-label="Submit"
                    >
                        {isStockUpdate ? 'Update' : 'Add'} Stock
                    </button>
                </div>
            </form>
            
            <Modal
                    show={isModalOpen}
                    onClose={closeModal}
                    showMessage={showMessage} />
        </>
    )
}

export default StockForm;
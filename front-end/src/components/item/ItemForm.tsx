import { useEffect, useState } from "react";
import axios from "axios";
import Modal from "../Modal";
import ItemType from "../../types/item/ItemType";
import CategoryType from "../../types/category/CategoryType";
import { useAuth } from "../../context/AuthContext";

interface ItemFormProps {
    itemUpdateId: number | undefined;
    onLoadItems: () => void;
    onSetItemUpdateId: (itemId: number) => void;
}

const ItemForm = ({ itemUpdateId, onLoadItems, onSetItemUpdateId }: ItemFormProps) => {

    const { jwtToken } = useAuth();
    const [preview, setPreview] = useState('');
    const [formData, setFormData] = useState<ItemType>({
        id: 0,
        name: '',
        description: '',
        price: 0,
        categoryId: 0,
        image: null,
        quantity: 0
    });
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [isItemUpdate, setItemUpdate] = useState<boolean>(false);

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        validateFile(file);
    };

    const validateFile = (file: File | null) => {
        if (file) {
            if (!file.type.startsWith('image/')) {
                openModal();
                setShowMessage({
                    title: 'Error',
                    message: 'Please select an image file!',
                    type: 'error'
                });
            } else if (file.size > 5000000) {
                openModal();
                setShowMessage({
                    title: 'Error',
                    message: 'File size is too large!',
                    type: 'error'
                });
            } else {
                setPreview(URL.createObjectURL(file));
                setFormData((prevData) => ({
                    ...prevData,
                    image: file,
                }));
                return true;
            }
        }else{
            openModal();
            setShowMessage({
                title: 'Error',
                message: 'Please select an image file!',
                type: 'error'
            });
            return false;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if(validateFile(formData.image)){
            try {
                await axios.post("http://localhost:8080/item", formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        ...config.headers
                    }
                })
                .then(response => {
                    onLoadItems();
                    openModal();
                    setShowMessage({
                        title: 'Success',
                        message: response.data,
                        type: 'success'
                    });
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
                    message: 'There is an error in submitting Item!',
                    type: 'error'
                });
            }
        }
    };

    useEffect(() => {
        if (itemUpdateId != null && itemUpdateId > 0) {
            handleItemEdit(itemUpdateId);
        }
    }, [itemUpdateId]);

    const handleItemEdit = async (itemId?: number) => {

        try {
            await axios.get(`http://localhost:8080/item-by-id-with-image/${itemId}`, config)
            .then(response => { 
                setFormData(response.data);
                setFormData((prevData) => ({
                    ...prevData,
                    categoryId: response.data.category.id,
                }));
                setItemUpdate(true);
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

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if(validateFile(formData.image)){
            try {
                await axios.put(`http://localhost:8080/item/${formData.id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        ...config.headers
                    }
                })
                .then(response => {
                    onLoadItems();
                    openModal(); 
                    setShowMessage({
                        title: 'Success',
                        message: response.data,
                        type: 'success'
                    });
                    setItemUpdate(false);
                    clearFormData();
                    onSetItemUpdateId(0);
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
                    message: 'There is an error in updating Item!',
                    type: 'error'
                });
            }
        }
    };

    const clearFormData = () => {
        setFormData({
            id: 0,
            name: '',
            description: '',
            price: 0,
            categoryId: 0,
            image: null,
            quantity: 0
        });
        setPreview('');
    }

    return (
        <>
            <form onSubmit={ isItemUpdate ? handleUpdate : handleSubmit }>
                <div
                className="relative text-gray-500 focus-within:text-purple-600 dark:focus-within:text-purple-400 px-8 mt-10"
                >
                    <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="block w-64 h-10 pl-10 mt-1 text-sm bg-purple-100 text-gray-500 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input rounded-xl"
                        placeholder="Item Name"
                    />
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
                            <path d="M12 3H8C6.11438 3 5.17157 3 4.58579 3.58579C4 4.17157 4 5.11438 4 7V7.95M12 3H16C17.8856 3 18.8284 3 19.4142 3.58579C20 4.17157 20 5.11438 20 7V7.95M12 3V8M12 21V12"/> <path d="M7 21H17"/>
                        </svg>
                    </div>
                </div>  
                <div
                className="relative text-gray-500 focus-within:text-purple-600 dark:focus-within:text-purple-400 px-8 mt-5"
                >
                    <input
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="block w-64 h-10 pl-10 mt-1 text-sm bg-purple-100 text-gray-500 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input rounded-xl"
                        placeholder="Item Description"
                    />
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
                            <path d="M12 3H8C6.11438 3 5.17157 3 4.58579 3.58579C4 4.17157 4 5.11438 4 7V7.95M12 3H16C17.8856 3 18.8284 3 19.4142 3.58579C20 4.17157 20 5.11438 20 7V7.95M12 3V8M12 21V12"/> <path d="M7 21H17"/>
                        </svg>
                    </div>
                </div> 
                <div
                className="relative text-gray-500 focus-within:text-purple-600 dark:focus-within:text-purple-400 px-8 mt-5"
                >
                    <input
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="block w-64 h-10 pr-5 mt-1 text-sm text-right bg-purple-100 text-gray-500 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input rounded-xl"
                        placeholder="Item Price"
                    />
                    <div
                        className="absolute inset-y-0 flex items-center ml-3 pointer-events-none"
                    >
                        <svg
                        className="w-5 h-5"
                        aria-hidden="true"
                        fill="currentColor"
                        viewBox="0 0 30 30"
                        >
                            <path d="M5.5 5c-.655 0-.66 1.01 0 1h22c.286 0 .5.214.5.5v13c0 .66 1 .66 1 0v-13c0-.822-.678-1.5-1.5-1.5h-22zm-2 2c-.654 0-.654 1 0 1h22c.286 0 .5.214.5.5v13c0 .665 1.01.66 1 0v-13c0-.822-.678-1.5-1.5-1.5h-22zm-2 2C.678 9 0 9.678 0 10.5v12c0 .822.678 1.5 1.5 1.5h22c.822 0 1.5-.678 1.5-1.5v-12c0-.822-.678-1.5-1.5-1.5h-22zm0 1h22c.286 0 .5.214.5.5v12c0 .286-.214.5-.5.5h-22c-.286 0-.5-.214-.5-.5v-12c0-.286.214-.5.5-.5zm1 1c-.276 0-.5.224-.5.5v2c0 .672 1 .656 1 0V12h1.5c.672 0 .656-1 0-1h-2zm10 0C9.468 11 7 13.468 7 16.5S9.468 22 12.5 22s5.5-2.468 5.5-5.5-2.468-5.5-5.5-5.5zm8 0c-.656 0-.672 1 0 1H22v1.5c0 .656 1 .672 1 0v-2c0-.276-.224-.5-.5-.5h-2zm-8 1c2.49 0 4.5 2.01 4.5 4.5S14.99 21 12.5 21 8 18.99 8 16.5s2.01-4.5 4.5-4.5zm0 1c-.277 0-.5.223-.5.5v.594c-.578.21-1 .76-1 1.406 0 .82.68 1.5 1.5 1.5.28 0 .5.212.5.5 0 .288-.22.5-.5.5h-1c-.338-.005-.5.248-.5.5s.162.505.5.5h.5v.5c0 .277.223.5.5.5s.5-.223.5-.5v-.594c.578-.21 1-.76 1-1.406 0-.82-.68-1.5-1.5-1.5-.28 0-.5-.212-.5-.5 0-.288.22-.5.5-.5h1c.338.005.5-.248.5-.5s-.162-.505-.5-.5H13v-.5c0-.277-.223-.5-.5-.5zm-10 6.002c-.25-.002-.5.162-.5.498v2c0 .276.224.5.5.5h2c.656 0 .672-1 0-1H3v-1.5c0-.328-.25-.496-.5-.498zm20 0c-.25.002-.5.17-.5.498V21h-1.5c-.672 0-.656 1 0 1h2c.276 0 .5-.224.5-.5v-2c0-.336-.25-.5-.5-.498z"/>
                        </svg>
                    </div>
                </div> 
                <div
                className="relative text-gray-500 focus-within:text-purple-600 dark:focus-within:text-purple-400 px-8 mt-5"
                >
                    <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    className="block w-64 h-10 pl-10 mt-1 text-sm bg-purple-100 text-gray-500 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input rounded-xl"
                    >
                        <option value="0">Select Item Category</option>
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
                            <path d="M3.75 5.5a.75.75 0 000 1.5h10a.75.75 0 000-1.5h-10zm5 6a.75.75 0 000 1.5h11.5a.75.75 0 000-1.5H8.75zm0 6a.75.75 0 000 1.5h11.5a.75.75 0 000-1.5H8.75zM5 12a1 1 0 11-2 0 1 1 0 012 0zm-1 7a1 1 0 100-2 1 1 0 000 2z"/>
                            <path d="M19.309 7.918l-2.245-2.501A.25.25 0 0117.25 5h4.49a.25.25 0 01.185.417l-2.244 2.5a.25.25 0 01-.372 0z"/>
                        </svg>
                    </div>
                    
                </div>    
                <div
                className="relative px-8 mt-5 text-left flex"
                >
                    <input type="file" id="item-uploadactual-btn" onChange={handleFileChange} hidden/>

                    <label 
                        className='text-sm font-semibold transition-colors duration-150 w-10 h-10 px-2 py-2 bg-purple-200 hover:bg-purple-600 rounded-xl shadow-xl focus:shadow-outline-purple focus:outline-none text-gray-500 hover:text-white cursor-pointer mt-3'
                        aria-label="Upload"
                        htmlFor="item-uploadactual-btn" 
                    >
                        <svg 
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="0.5">
                            <path d="M12 1.25C12.2189 1.25 12.427 1.34567 12.5694 1.51191L15.5694 5.01191C15.839 5.3264 15.8026 5.79988 15.4881 6.06944C15.1736 6.33901 14.7001 6.30259 14.4306 5.98809L12.75 4.02744L12.75 15C12.75 15.4142 12.4142 15.75 12 15.75C11.5858 15.75 11.25 15.4142 11.25 15L11.25 4.02744L9.56944 5.98809C9.29988 6.30259 8.8264 6.33901 8.51191 6.06944C8.19741 5.79988 8.16099 5.3264 8.43056 5.01191L11.4306 1.51191C11.573 1.34567 11.7811 1.25 12 1.25ZM6.99583 8.25196C7.41003 8.24966 7.74768 8.58357 7.74999 8.99778C7.7523 9.41198 7.41838 9.74963 7.00418 9.75194C5.91068 9.75803 5.1356 9.78642 4.54735 9.89448C3.98054 9.99859 3.65246 10.1658 3.40901 10.4092C3.13225 10.686 2.9518 11.0746 2.85315 11.8083C2.75159 12.5637 2.75 13.5648 2.75 15.0002V16.0002C2.75 17.4356 2.75159 18.4367 2.85315 19.1921C2.9518 19.9259 3.13225 20.3144 3.40901 20.5912C3.68577 20.868 4.07434 21.0484 4.80812 21.1471C5.56347 21.2486 6.56458 21.2502 8 21.2502H16C17.4354 21.2502 18.4365 21.2486 19.1919 21.1471C19.9257 21.0484 20.3142 20.868 20.591 20.5912C20.8678 20.3144 21.0482 19.9259 21.1469 19.1921C21.2484 18.4367 21.25 17.4356 21.25 16.0002V15.0002C21.25 13.5648 21.2484 12.5637 21.1469 11.8083C21.0482 11.0746 20.8678 10.686 20.591 10.4092C20.3475 10.1658 20.0195 9.99859 19.4527 9.89448C18.8644 9.78642 18.0893 9.75803 16.9958 9.75194C16.5816 9.74963 16.2477 9.41198 16.25 8.99778C16.2523 8.58357 16.59 8.24966 17.0042 8.25196C18.0857 8.25798 18.9871 8.28387 19.7236 8.41916C20.4816 8.55839 21.1267 8.82363 21.6517 9.34856C22.2536 9.95048 22.5125 10.7084 22.6335 11.6085C22.75 12.4754 22.75 13.5778 22.75 14.9453V16.0551C22.75 17.4227 22.75 18.525 22.6335 19.392C22.5125 20.2921 22.2536 21.0499 21.6517 21.6519C21.0497 22.2538 20.2919 22.5127 19.3918 22.6337C18.5248 22.7503 17.4225 22.7502 16.0549 22.7502H7.94513C6.57754 22.7502 5.47522 22.7503 4.60825 22.6337C3.70814 22.5127 2.95027 22.2538 2.34835 21.6519C1.74643 21.0499 1.48754 20.2921 1.36652 19.392C1.24996 18.525 1.24998 17.4227 1.25 16.0551V14.9453C1.24998 13.5777 1.24996 12.4754 1.36652 11.6085C1.48754 10.7084 1.74643 9.95048 2.34835 9.34856C2.87328 8.82363 3.51835 8.55839 4.27635 8.41916C5.01291 8.28386 5.9143 8.25798 6.99583 8.25196Z"/>
                        </svg>
                    </label>

                    <div className=" ml-5">
                        {preview ? <img src={preview} className="w-16 h-16 rounded-xl" /> : ''}
                    </div>
                </div>  
                <div
                className="relative px-8 mt-5"
                >
                    <button 
                        className='text-sm font-semibold transition-colors duration-150 w-36 h-10 px-2 py-2 bg-purple-200 hover:bg-purple-600 rounded-xl shadow-xl focus:shadow-outline-purple focus:outline-none text-purple-500 hover:text-white cursor-pointer'
                        aria-label="Submit"
                    >
                        {isItemUpdate ? 'Update' : 'Add' } Item
                    </button>
                </div>              
            </form>

            <Modal 
                show={isModalOpen} 
                onClose={closeModal} 
                showMessage={showMessage}
            />
        </>
    )
}

export default ItemForm;
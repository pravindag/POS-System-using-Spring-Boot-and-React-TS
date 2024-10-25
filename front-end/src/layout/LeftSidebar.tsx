import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import systemIcon from '../assets/img/system-icon.png'

const LeftSidebar = () => {
    
    const { userRole, logout } = useAuth();
    const [selectedItem, setSelectedItem] = useState<string>('/user/dashboard');
    
    useEffect(() => {
        setSelectedItem(window.location.pathname);
    },[])

    const menuItems = (userRole == 'user') ? 
        [
            {   id: '/user/dashboard', 
                label: 'Dashboard', 
                path: '/user/dashboard', 
                icon: <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
            },
            {   id: '/user/item', 
                label: 'Item', 
                path: '/user/item', 
                icon: <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
            },
            {   id: '/user/stock', 
                label: 'Stock', 
                path: '/user/stock', 
                icon: <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
            },
        ]
        : [];

    return (
        <aside className="z-20 hidden w-56 overflow-y-auto bg-white md:block flex-shrink-0">
            <div className="py-4 text-gray-500 dark:text-gray-400">
                <div className='inline-flex items-center'>
                    <img src={systemIcon} className='w-12 h-12' />
                    <h1 className="text-base font-bold text-gray-800">POS SYSTEM</h1>
                </div>
                <ul className="mt-6">
                    {menuItems.map((item) => (
                        <li key={item.id} className="relative px-6 py-3">
                            <Link
                                to={item.path}
                                className={`inline-flex items-center w-40 text-sm font-semibold transition-colors duration-150 ${
                                selectedItem === item.id ? 'text-gray-100 px-3 py-2 leading-5 bg-purple-600 border border-transparent rounded-xl active:bg-purple-300 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple' : 'text-gray-700 hover:text-purple-800'
                                }`}
                                onClick={() => setSelectedItem(item.id)}
                            >
                                <svg 
                                className={`w-5 h-5 ${selectedItem === item.id ? 'text-gray-100' : 'text-purple-600' } `} 
                                aria-hidden="true" 
                                fill="none" 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth="2" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor">
                                    {item.icon}
                                </svg>
                                
                                <span className="ml-4">{item.label}</span>
                            </Link>
                        </li>
                    ))}
                    
                </ul>
            </div>
            <div className="relative mt-80"> 
                <ul className="flex flex-col justify-between">                    
                    <li className="relative px-6 py-3">
                        <button
                            className='inline-flex items-center text-sm font-semibold transition-colors duration-150 w-12 h-12 px-2 py-2 bg-purple-200 hover:bg-purple-600 align-middle rounded-xl shadow-xl focus:shadow-outline-purple focus:outline-none text-purple-600 hover:text-white'
                            aria-label="Logout" 
                            onClick={logout}
                        >
                            <svg 
                            fill="currentColor"
                            viewBox="0 -0.5 25 25"
                            stroke="currentColor"
                            strokeWidth="0.5">
                                <path d="M11.75 9.874C11.75 10.2882 12.0858 10.624 12.5 10.624C12.9142 10.624 13.25 10.2882 13.25 9.874H11.75ZM13.25 4C13.25 3.58579 12.9142 3.25 12.5 3.25C12.0858 3.25 11.75 3.58579 11.75 4H13.25ZM9.81082 6.66156C10.1878 6.48991 10.3542 6.04515 10.1826 5.66818C10.0109 5.29121 9.56615 5.12478 9.18918 5.29644L9.81082 6.66156ZM5.5 12.16L4.7499 12.1561L4.75005 12.1687L5.5 12.16ZM12.5 19L12.5086 18.25C12.5029 18.25 12.4971 18.25 12.4914 18.25L12.5 19ZM19.5 12.16L20.2501 12.1687L20.25 12.1561L19.5 12.16ZM15.8108 5.29644C15.4338 5.12478 14.9891 5.29121 14.8174 5.66818C14.6458 6.04515 14.8122 6.48991 15.1892 6.66156L15.8108 5.29644ZM13.25 9.874V4H11.75V9.874H13.25ZM9.18918 5.29644C6.49843 6.52171 4.7655 9.19951 4.75001 12.1561L6.24999 12.1639C6.26242 9.79237 7.65246 7.6444 9.81082 6.66156L9.18918 5.29644ZM4.75005 12.1687C4.79935 16.4046 8.27278 19.7986 12.5086 19.75L12.4914 18.25C9.08384 18.2892 6.28961 15.5588 6.24995 12.1513L4.75005 12.1687ZM12.4914 19.75C16.7272 19.7986 20.2007 16.4046 20.2499 12.1687L18.7501 12.1513C18.7104 15.5588 15.9162 18.2892 12.5086 18.25L12.4914 19.75ZM20.25 12.1561C20.2345 9.19951 18.5016 6.52171 15.8108 5.29644L15.1892 6.66156C17.3475 7.6444 18.7376 9.79237 18.75 12.1639L20.25 12.1561Z"/>
                            </svg>
                        </button>
                    </li>
                </ul>
            </div>
        </aside>
    );
};

export default LeftSidebar;

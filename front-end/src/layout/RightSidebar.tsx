import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import systemIcon from '../assets/img/system-icon.png'

const RightSidebar = () => {
    
    const { userRole } = useAuth();
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
        ]
        : [];

    return (
        <aside className="z-20 hidden w-96 overflow-y-auto bg-white md:block flex-shrink-0 ml-auto">
            <div className="py-4 text-gray-500 dark:text-gray-400">
                <div className="inline-flex items-center">
                <img src={systemIcon} className="w-12 h-12" alt="System Icon" />
                <h1 className="text-base font-bold text-gray-800">POS SYSTEM</h1>
                </div>
                <ul className="mt-6">
                {menuItems.map((item) => (
                    <li key={item.id} className="relative px-6 py-3">
                    <Link
                        to={item.path}
                        className={`inline-flex items-center w-40 text-sm font-semibold transition-colors duration-150 ${
                        selectedItem === item.id
                            ? 'text-gray-100 px-3 py-2 leading-5 bg-purple-600 border border-transparent rounded-xl active:bg-purple-300 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple'
                            : 'text-gray-700 hover:text-purple-800'
                        }`}
                        onClick={() => setSelectedItem(item.id)}
                    >
                        <svg
                        className={`w-5 h-5 ${
                            selectedItem === item.id ? 'text-gray-100' : 'text-purple-600'
                        }`}
                        aria-hidden="true"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        >
                        {item.icon}
                        </svg>

                        <span className="ml-4">{item.label}</span>
                    </Link>
                    </li>
                ))}
                </ul>
            </div>
            </aside>

    );
};

export default RightSidebar;

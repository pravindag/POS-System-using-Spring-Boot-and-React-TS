const Header = () => {

    return (
        <header className="z-10 py-7">
            <div className="container flex items-center justify-between h-full px-6 mx-auto text-purple-600">
            
            {/* List Button */}
                <button className="justify-start w-11 h-11 px-2 py-2 bg-white hover:bg-purple-600 align-middle rounded-xl shadow-lg focus:shadow-outline-purple focus:outline-none text-purple-600 hover:text-white">
                    <svg 
                    fill="currentColor" 
                    viewBox="0 0 24 24">
                        <path d="M8 6.00067L21 6.00139M8 12.0007L21 12.0015M8 18.0007L21 18.0015M3.5 6H3.51M3.5 12H3.51M3.5 18H3.51M4 6C4 6.27614 3.77614 6.5 3.5 6.5C3.22386 6.5 3 6.27614 3 6C3 5.72386 3.22386 5.5 3.5 5.5C3.77614 5.5 4 5.72386 4 6ZM4 12C4 12.2761 3.77614 12.5 3.5 12.5C3.22386 12.5 3 12.2761 3 12C3 11.7239 3.22386 11.5 3.5 11.5C3.77614 11.5 4 11.7239 4 12ZM4 18C4 18.2761 3.77614 18.5 3.5 18.5C3.22386 18.5 3 18.2761 3 18C3 17.7239 3.22386 17.5 3.5 17.5C3.77614 17.5 4 17.7239 4 18Z" 
                        stroke="currentColor" 
                        strokeWidth="2.064" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"/>
                    </svg>
                </button>

                <div className="flex justify-start flex-1 pl-5 pr-5">
                    <div className="relative w-full max-w-3xl focus-within:text-purple-500">
                        <div className="absolute inset-y-0 flex items-center pl-2">
                            <svg
                                className="w-4 h-4"
                                aria-hidden="true"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                fillRule="evenodd"
                                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                clipRule="evenodd"
                                ></path>
                            </svg>
                        </div>
                        <input
                        className="w-full h-11 pl-8 pr-2 text-sm text-gray-700 placeholder-gray-600 bg-white border-0 rounded-xl shadow-lg focus:placeholder-gray-500 focus:bg-white focus:border-purple-300 focus:outline-none focus:shadow-outline-purple form-input"
                        type="text"
                        placeholder="Search Items here"
                        aria-label="Search"
                        />
                    </div>
                </div>

                {/* List Button */}
                <button className="justify-start w-11 h-11 px-2 py-2 bg-white hover:bg-purple-600 align-middle rounded-xl shadow-lg focus:shadow-outline-purple focus:outline-none text-purple-600 hover:text-white">
                    <svg fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 7L20 7" 
                        stroke="currentColor" 
                        strokeLinecap="round"/> 

                        <path d="M4 7L8 7" 
                        stroke="currentColor" 
                        strokeLinecap="round"/>

                        <path d="M17 17L20 17" 
                        stroke="currentColor" 
                        strokeLinecap="round"/> 

                        <path d="M4 17L12 17" 
                        stroke="currentColor" 
                        strokeLinecap="round"/> 

                        <circle cx="10" cy="7" r="2" 
                        transform="rotate(90 10 7)" 
                        stroke="currentColor" 
                        strokeLinecap="round"/> 

                        <circle cx="15" cy="17" r="2" 
                        transform="rotate(90 15 17)" 
                        stroke="currentColor" 
                        strokeLinecap="round"/>
                    </svg>
                </button>
            </div>
        </header>
    );
};

export default Header;

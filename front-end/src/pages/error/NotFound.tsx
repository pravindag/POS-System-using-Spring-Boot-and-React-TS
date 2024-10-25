import { useEffect, useState } from "react";
import LoadingGif from "../../components/LoadingGif";
import LeftSidebar from "../../layout/LeftSidebar";

const NotFound = () => {

    const [isPageLoaded, setIsPageLoaded] = useState<boolean>(false);

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
        }
    }, []);
    
    if (!isPageLoaded) {
        return <LoadingGif />;
    }

    return (
        <div className="flex w-full h-screen bg-gray-50 ">
            <LeftSidebar />

            <div className="py-10 flex flex-col flex-1 w-full">
                           
                <main className="h-full overflow-y-auto">
                    <div className="container flex flex-col items-center px-6 mx-auto">
                        <svg
                        className="w-12 h-12 mt-8 text-purple-300"
                        fill="currentColor"
                        viewBox="0 0 219.328 219.328"
                        >
                            <path d="M185.726,30.746c-0.086-0.096-0.168-0.195-0.26-0.287c-0.198-0.198-0.406-0.381-0.62-0.552 C165.201,11.377,138.738,0,109.666,0C49.198,0,0.003,49.196,0.003,109.668c0.002,29.059,11.369,55.51,29.884,75.152 c0.177,0.224,0.365,0.441,0.572,0.647c0.107,0.106,0.22,0.2,0.331,0.299c19.957,20.679,47.94,33.562,78.877,33.562 c60.466,0,109.659-49.193,109.659-109.661C219.325,78.707,206.427,50.706,185.726,30.746z M109.666,15 c22.538,0,43.256,7.923,59.53,21.123L36.125,169.194c-13.198-16.273-21.12-36.991-21.122-59.527C15.003,57.468,57.469,15,109.666,15 z M109.666,204.328c-24.269,0-46.432-9.186-63.204-24.258l133.61-133.609c15.07,16.772,24.253,38.936,24.253,63.206 C204.325,161.863,161.861,204.328,109.666,204.328z"/>
                        </svg>
                        <h1 className="mt-2 text-6xl font-semibold text-purple-700 dark:text-gray-200">
                        404
                        </h1>
                        <p className="text-gray-700 dark:text-gray-300">
                        Page not found. Check the address.
                        </p>
                    </div>
                </main>
            </div>
        </div>
    )

}

export default NotFound;
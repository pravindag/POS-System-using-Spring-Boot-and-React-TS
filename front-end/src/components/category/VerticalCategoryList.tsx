import { useState } from "react";

interface StockProps {
    onSelectCategory: (id: number) => void;
}

const VerticalCategoryList = ({ onSelectCategory }: StockProps) => {

    const [activeCategoryId, setActiveCategoryId] = useState<number>(0);

    return (
        <div
            className="overflow-y-auto grid grid-flow-row gap-3"
        >
                <div
                    className={`px-2 py-2 justify-start w-28 h-32 rounded-xl shadow-lg inline-block cursor-pointer 
                        ${activeCategoryId == 8 ? 'bg-purple-300 text-white' : 'text-slate-600 bg-purple-100 border border-purple-300 hover:bg-purple-300 hover:text-white'}`}
                    onClick={() => {onSelectCategory(8), setActiveCategoryId(8)}}
                >
                    <div className="pl-3 pt-3 text-left text-purple-600">
                        <svg 
                            className="w-10 h-10"
                            viewBox="-55.41 0 439.71 439.71" 
                            fill="currentColor"
                            stroke="currentColor"
                            strokeWidth="4">
                            <path d="M320.4,94.61H307.46l-8.74-48.56a8.51,8.51,0,0,0-8.37-7h-8.1l-7.66-32.5A8.51,8.51,0,0,0,263.71.41L206.1,19a8.5,8.5,0,0,0-5.89,8.09v12H38.55a8.5,8.5,0,0,0-8.36,7L21.45,94.61H8.5a8.51,8.51,0,0,0-8.5,8.5v46.68a8.51,8.51,0,0,0,8.5,8.5H19.94l34.28,274a8.5,8.5,0,0,0,8.43,7.45h203.6a8.51,8.51,0,0,0,8.44-7.45l34.28-274H320.4a8.5,8.5,0,0,0,8.5-8.5V103.11A8.5,8.5,0,0,0,320.4,94.61ZM217.21,33.27l43-13.85,4.63,19.63H217.21ZM45.66,56.05H283.24l6.94,38.56H38.72ZM267.2,355.19H61.71L48.46,249.28h232Zm-8.45,67.52H70.16l-7.58-60.52H266.32Zm22.57-180.43H47.58l-10.51-84H291.83Zm30.58-101H17V111.61H311.9Z"/> 
                            <path d="M178.58,274.16a4,4,0,0,1-1.08,1.47c-5.46,4.7-6.08,12.85-6.79,22.28-.83,10.92-1.76,23.2-10.28,33.93,10.2,0,21-8.17,26.29-20.88C193,295.88,189.35,279.83,178.58,274.16Z"/> 
                            <path d="M170.89,271.15c-10,.35-20.49,8.41-25.71,20.87-6.27,15-2.68,30.92,7.94,36.69a3.75,3.75,0,0,1,.73-1.11c8.39-9.14,9.24-20.39,10.07-31.27C164.61,287.29,165.31,278,170.89,271.15Z"/>
                        </svg>
                    </div>
                    <div className="pl-3 pt-5 text-left">
                        <span className="text-sm font-semibold">Beverages</span>
                    </div>
                </div>
        </div>
    )

}

export default VerticalCategoryList;
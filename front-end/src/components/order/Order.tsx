import ItemType from "../../types/item/ItemType";
import LoadingGif from "../LoadingGif";

interface OrderProps {
    orders: ItemType[];
    removeOrderItem: (item: ItemType) => void;
}

const Order = ({orders, removeOrderItem}: OrderProps) => {

    return (
        <div
        className="p-2 grid grid-rows-1"
        >
            {orders.map((order) => (
                <div
                    key={order.id}
                    className='mb-2 px-2 py-2 flex justify-start w-[298px] text-gray-600 border bg-purple-50 border-purple-300 border-1 hover:border-purple-600 hover:border-2 rounded-xl cursor-pointer animate-fade-in-bottom'
                >
                    
                    <div className="relative hidden m-1 rounded-xl md:block">
                        <img
                            className="object-cover w-14 h-14 rounded-xl"
                            src={"http://localhost:8080/" + order.imagePath}
                            alt="Item Image"
                            loading="lazy"
                        />
                    </div>
                    <div className="grid grid-rows-2">
                        <div className="ml-2 pt-1 flex justify-between">
                            <div>
                                <span className="text-sm font-semibold">{order.name}</span>
                            </div>
                            <div>
                                <button 
                                    onClick={() => removeOrderItem(order) }
                                    className="w-5 h-5 bg-purple-200 hover:bg-purple-500 rounded-md text-gray-600 hover:text-white cursor-pointer text-base font-semibold flex justify-center items-center"
                                >
                                    &times;
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 ml-2 pt-2">
                            <span className="text-xs font-semibold text-purple-400 text-left">
                                Rs. {Intl.NumberFormat("en-US", {maximumFractionDigits: 2}).format(order.price)}.00
                            </span>
                            <span className="pl-2 text-xs font-semibold text-gray-600 text-left">
                                {order.quantity}X
                            </span>
                            <span className="text-xs font-semibold text-purple-600 text-right">
                                Rs. {Intl.NumberFormat("en-US", {maximumFractionDigits: 2}).format(order.price * order.quantity)}.00
                            </span>
                        </div>
                    </div>
                </div>            
            ))}
            { orders.length == 0 && 
                (<div className="mt-36">
                    <LoadingGif />
                </div>)
            }
        </div>
    )

}

export default Order;
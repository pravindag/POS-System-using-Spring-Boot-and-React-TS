interface ModalProps {
  show: boolean;
  onClose: () => void;
  showMessage: {
    title: string,
    message: string,
    type: string
  }
}

const Modal = ({ show, onClose, showMessage }: ModalProps) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-purple-100 rounded-lg w-[500px] animate-fade-in-bottom">

                <div className="flex justify-between items-center">
                    <h2 className={`mt-2 ml-4 text-xl font-semibold ${ showMessage.type == 'error' ? 'text-red-500' : 'text-green-500'}`}>{showMessage.title}</h2>
                    <button 
                        onClick={onClose} 
                        className="mt-3 mr-3 w-6 h-6 bg-purple-200 hover:bg-purple-500 rounded-lg text-gray-600 hover:text-white cursor-pointer text-base font-semibold flex justify-center items-center"
                    >
                        &times;
                    </button>
                </div>

                <div className="m-4 text-left text-gray-600 text-sm mb-3">
                    {showMessage.message}
                </div>
                    
                <div className="flex justify-end mt-4 mb-3 mr-3">
                    <button onClick={onClose} className="text-sm font-semibold transition-colors duration-150 px-4 py-2 bg-purple-400 hover:bg-purple-600 rounded-xl shadow-xl focus:shadow-outline-purple focus:outline-none text-white cursor-pointer">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;

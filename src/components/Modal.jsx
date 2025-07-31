import { X } from 'lucide-react'

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose()
        }
    }

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content">
                <div className="modal-header">
                    <h2>{title}</h2>
                    <button 
                        className="modal-close"
                        onClick={onClose}
                        aria-label="Fechar modal"
                    >
                        <X size={24} />
                    </button>
                </div>
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Modal
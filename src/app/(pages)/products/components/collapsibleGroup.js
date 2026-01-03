import React, { useState ,useEffect} from 'react';
// Assuming you have access to icons like react-icons/hi or similar
import { HiChevronDown } from 'react-icons/hi'; 

// --- Collapsible Group Component Structure ---
// (You would define this helper component outside the main return or in a separate file)
export const CollapsibleGroup = ({ title, children, defaultOpen = true }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    const toggleOpen = () => setIsOpen(!isOpen);

 

    return (
        <div className="flex flex-col pt-6 border-t border-gray-200 mb-6">
            {/* Header: Clickable label with toggle icon */}
            <button 
                type="button" // Important for forms to prevent submission
                onClick={toggleOpen} 
                className="flex justify-between items-center text-lg font-extrabold text-gray-800 mb-3 w-full text-left hover:text-emerald-600 transition"
            >
                {title}
                <HiChevronDown 
                    size={24} 
                    className={`transform transition-transform duration-300 ${isOpen ? '' : '-rotate-90'}`}
                />
            </button>
            
            {/* Content: Conditionally rendered/styled */}
            <div 
                className={`overflow-y-auto   transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}
            >
                {children}
            </div>
        </div>
    );
};
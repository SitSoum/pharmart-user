export const CategoryCard = ({ name, color, shadow, Icon }) => (
    <div 
        className={`
            relative ${color} 
            flex flex-col shrink-0 
            justify-center items-center p-4 
            min-w-38 h-48.5 
            border border-gray-200 rounded-xl 
            shadow-lg hover:shadow-xl transition-shadow duration-300 
            ${shadow}
        `}
    >
        {/* Render the Icon prop as a component */}
        <Icon size={48} className="text-gray-700" />
        
        {/* Label is positioned absolutely at the bottom */}
        <label className="absolute bottom-4 text-center text-sm font-semibold text-gray-800 px-1">
            {name}
        </label>
    </div>
);
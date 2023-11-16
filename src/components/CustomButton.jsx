import React from 'react';

const CustomButton = ({ onClick, children, isActive, className }) => {
    return (
        <button
            onClick={onClick}
            className={` ${className} h-50 rounded-md text-xl mt-4 ${
                isActive ? 'bg-customColor' : 'bg-gray-500'
            } text-gray-100 hover:opacity-90 active:relative active:top-1px`}
        >
            {children}
        </button>
    );
};

export default CustomButton;
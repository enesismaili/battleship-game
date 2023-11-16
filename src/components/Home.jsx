import React from 'react';
import { useNavigate } from 'react-router-dom';
import CustomButton from "./CustomButton";

export const Home = () => {
    const navigate = useNavigate();

    const startPlay = () => {
        navigate('/game', { replace: true });
    };

    return (
        <div className="text-center w-1/2 ml-auto mr-auto p-8 bg-gray-100">
            <h2 className="text-customColor uppercase text-2xl font-asul mb-4">Rules</h2>
            <p className="text-gray-700 text-base mb-8">
                You and your opponent are competing navy commanders. Your fleets are positioned at secret
                coordinates, and you take turns firing torpedoes at each other. The first to sink the other
                person’s whole fleet wins!
            </p>
            <CustomButton isActive={true} onClick={startPlay} className=" w-20 sm:w-48">
                Play
            </CustomButton>
        </div>
    );
};

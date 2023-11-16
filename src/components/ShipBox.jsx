import React from 'react';

export const ShipBox = ({
                               shipName,
                               selectShip,
                               ships,
                               isCurrentlyPlacing,
                               selectedOrientation,
                           }) => {
    let ship = ships.find((item) => item.name === shipName);
    let shipLength = new Array(ship.length).fill('ship');
    let orientationClass = selectedOrientation === 'vertical' ? 'vertical' : 'horizontal';
    let allSquares = shipLength.map((item, index) => (
        <div
            className={`w-5 h-5 border border-customColor bg-smallSquareColor ${orientationClass}`}
            key={index}
        />
    ));

    return (
        <div
            id={`${shipName}-ship`}
            onClick={() => selectShip(shipName)}
            key={`${shipName}`}
            className={`flex items-center justify-between w-48 mt-2 h-35 rounded-md p-2 cursor-pointer ${
                isCurrentlyPlacing ? 'bg-gray-200' : 'bg-customColor'
            } ${orientationClass} ${isCurrentlyPlacing ? 'placing' : ''}`}
        >
            <div className={`text-white text-sm capitalize ${isCurrentlyPlacing ? 'text-indigo-800' : ''}`}>
                {shipName}
            </div>
            <div className={`${orientationClass === 'vertical' ? 'block' : 'flex'}`}>
                {allSquares}
            </div>
        </div>
    );
};

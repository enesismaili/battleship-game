import React from 'react';
import {
    SQUARE_STATE,
    stateToClass,
    generateEmptyLayout,
    putEntityInLayout,
    indexToCoords,
    calculateOverhang,
    canBePlaced,
} from '../../utils/layoutFunctions';
import {useGameContext} from "../../context/GameContext";
import {IoMdClose} from "react-icons/io";

export const Player = () => {

    const {
        currentlyPlacing,
        setCurrentlyPlacing,
        placeShip,
        placedShips,
        hitsByEnemy,
        playSound,
    } = useGameContext()

    // Player ships on empty layout
    let layout = placedShips.reduce(
        (prevLayout, currentShip) =>
            putEntityInLayout(prevLayout, currentShip, SQUARE_STATE.ship),
        generateEmptyLayout()
    );

    // Hits by enemy
    layout = hitsByEnemy.reduce(
        (prevLayout, currentHit) =>
            putEntityInLayout(prevLayout, currentHit, currentHit.type),
        layout
    );

    layout = placedShips.reduce(
        (prevLayout, currentShip) =>
            currentShip.sunk
                ? putEntityInLayout(prevLayout, currentShip, SQUARE_STATE.ship_sunk)
                : prevLayout,
        layout
    );

    const isPlacingOverBoard = currentlyPlacing && currentlyPlacing.position != null;
    const canPlaceCurrentShip = isPlacingOverBoard && canBePlaced(currentlyPlacing, layout);

    if (isPlacingOverBoard && canPlaceCurrentShip) {
        layout = putEntityInLayout(layout, currentlyPlacing, SQUARE_STATE.ship);
    } else if (isPlacingOverBoard) {
        let forbiddenShip = {
            ...currentlyPlacing,
            length: currentlyPlacing.length - calculateOverhang(currentlyPlacing),
        };
        layout = putEntityInLayout(layout, forbiddenShip, SQUARE_STATE.forbidden);
    }

    let squares = layout.map((square, index) => {
        const isHitSquare = ['hit', 'miss', 'ship-sunk'].includes(stateToClass[square]);
        return (
            <div
                onClick={() => {
                    if (canPlaceCurrentShip) {
                        playSound('click');
                        placeShip(currentlyPlacing);
                    }
                }}
                className={`square ${stateToClass[square]} cursor-pointer transition-colors duration-100 ease-in-out flex items-center`}
                key={`square-${index}`}
                id={`square-${index}`}
                onMouseOver={() => {
                    if (currentlyPlacing) {
                        setCurrentlyPlacing({
                            ...currentlyPlacing,
                            position: indexToCoords(index),
                        });
                    }
                }}
            >
                {isHitSquare && stateToClass[square] !== 'ship-sunk' && (
                    <IoMdClose className={'m-auto w-5 h-5'}  />
                )}
            </div>
        );
    });

    return (
        <div className={'text-center ml-36 sm:ml-10'}>
            <h2 className="text-customColor text-lg font-bold mb-4">You</h2>
            <div className="flex flex-wrap board">{squares}</div>
        </div>
    );
};

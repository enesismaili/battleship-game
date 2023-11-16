import React from 'react';
import {useGameContext} from '../../context/GameContext';
import {ShipBox} from '../ShipBox';
import CustomButton from "../CustomButton";

export const PlayerFleet = () => {
    const {
        ships,
        selectShip,
        currentlyPlacing,
        startAgain,
        startTurn,
        rotateShip,
        selectedOrientation,
        gameStarted
    } = useGameContext();
    let shipsLeft = ships.map((ship) => ship.name);

    let shipBoxes = shipsLeft.map((shipName) => (
        <ShipBox
            selectShip={selectShip}
            key={shipName}
            isCurrentlyPlacing={currentlyPlacing && currentlyPlacing.name === shipName}
            shipName={shipName}
            ships={ships}
            selectedOrientation={selectedOrientation}
        />
    ));

    let fleet = (
        <div className="flex flex-col items-center">
            {shipBoxes}
        </div>
    );

    let playButton = (
        <div className="flex flex-col items-center">
            <CustomButton isActive={true} onClick={startTurn} className={'w-40'}>
                Start Game
            </CustomButton>
        </div>
    );

    return (
        !gameStarted &&
        <div className="flex flex-col items-center bg-gray-300 p-4 ml-36 sm:ml-0 rounded-md">
            <div className="text-customColor uppercase text-lg font-bold">Place Your Ships</div>
            <CustomButton
                onClick={() => {
                    rotateShip('vertical');
                }}
                isActive={selectedOrientation === 'vertical'}
                className={'w-40'}
            >
                Vertical
            </CustomButton>
            <CustomButton
                onClick={() => {
                    rotateShip('horizontal');
                }}
                isActive={selectedOrientation === 'horizontal'}
                className={'w-40'}
            >
                Horizontal
            </CustomButton>
                <p
                    className="cursor-pointer w-full text-customColor font-bold  mt-2 hover:bg-customColor hover:p-1 hover:text-sm hover:font-light hover:rounded hover:text-white"
                    onClick={startAgain}
                >
                    Restart
                </p>
            {ships.length > 0 ? fleet : playButton}
        </div>
    );
};

import React from 'react';
import {
    stateToClass,
    generateEmptyLayout,
    putEntityInLayout,
    SQUARE_STATE,
    indexToCoords,
    updateSunkShips,
} from '../../utils/layoutFunctions';
import {useGameContext} from "../../context/GameContext";
import { IoMdClose } from "react-icons/io";

export const Enemy = () => {
    const {
        enemyShips,
        gameState,
        hitsByPlayer,
        setHitsByPlayer,
        handleEnemyTurn,
        checkIfGameOver,
        setEnemyShips,
        playSound,
    } = useGameContext()
    // Ships on an empty layout
    let enemyLayout = enemyShips.reduce(
        (prevLayout, currentShip) =>
            putEntityInLayout(prevLayout, currentShip, SQUARE_STATE.ship),
        generateEmptyLayout()
    );

    //  Add hits dealt by player
    enemyLayout = hitsByPlayer.reduce(
        (prevLayout, currentHit) =>
            putEntityInLayout(prevLayout, currentHit, currentHit.type),
        enemyLayout
    );

    enemyLayout = enemyShips.reduce(
        (prevLayout, currentShip) =>
            currentShip.sunk
                ? putEntityInLayout(prevLayout, currentShip, SQUARE_STATE.ship_sunk)
                : prevLayout,
        enemyLayout
    );

    // Check what's at the square and decide what next
    const fireTorpedo = (index) => {
        if (enemyLayout[index] === 'ship') {
            const newHits = [
                ...hitsByPlayer,
                {
                    position: indexToCoords(index),
                    type: SQUARE_STATE.hit,
                },
            ];
            setHitsByPlayer(newHits);
            return newHits;
        }
        if (enemyLayout[index] === 'empty') {
            const newHits = [
                ...hitsByPlayer,
                {
                    position: indexToCoords(index),
                    type: SQUARE_STATE.miss,
                },
            ];
            setHitsByPlayer(newHits);
            return newHits;
        }
    };

    const playerTurn = gameState === 'player-turn';
    const playerCanFire = playerTurn && !checkIfGameOver();

    let alreadyHit = (index) =>
        enemyLayout[index] === 'hit' ||
        enemyLayout[index] === 'miss' ||
        enemyLayout[index] === 'ship-sunk';

    let enemySquares = enemyLayout.map((square, index) => {
        const isHitSquare = ['hit', 'miss', 'ship-sunk'].includes(stateToClass[square]);
        const isAlreadyHit = alreadyHit(index);

        return (
            <div
                className={`${
                    isHitSquare ? `square ${stateToClass[square]}` : 'square isHit'
                } enemy-square flex items-center`}
                key={`enemy-square-${index}`}
                id={`enemy-square-${index}`}
                onClick={() => {
                    if (playerCanFire && !isAlreadyHit) {
                        const newHits = fireTorpedo(index);
                        const shipsWithSunkFlag = updateSunkShips(newHits, enemyShips);
                        const sunkShipsAfter = shipsWithSunkFlag.filter((ship) => ship.sunk).length;
                        const sunkShipsBefore = enemyShips.filter((ship) => ship.sunk).length;
                        if (sunkShipsAfter > sunkShipsBefore) {
                            playSound('sunk');
                        }
                        setEnemyShips(shipsWithSunkFlag);
                        handleEnemyTurn();
                    }
                }}
            >
                {isAlreadyHit && stateToClass[square] !== 'ship-sunk' && (
                        <IoMdClose className={'m-auto w-6 h-6'}  />
                )}
            </div>
        );
    });


    return (
        <div className="text-center ml-36 sm:ml-0">
            <h2 className="text-customColor text-lg font-bold mb-4">Enemy</h2>
            <div className="flex flex-wrap board">{enemySquares}</div>
        </div>
    );
};

import React, {createContext, useContext, useRef, useState} from 'react';
import {
    placeAllEnemyShips,
    SQUARE_STATE,
    indexToCoords,
    putEntityInLayout,
    generateEmptyLayout,
    generateRandomIndex,
    getNeighbors,
    updateSunkShips,
    coordsToIndex,
} from '../utils/layoutFunctions';

const GameContext = createContext();

export const GameProvider = ({children}) => {
    const SHIPS = [
        {
            name: 'Carrier',
            length: 5,
            placed: null,
        },
        {
            name: 'Battleship',
            length: 4,
            placed: null,
        },
        {
            name: 'Destroyer',
            length: 3,
            placed: null,
        },
        {
            name: 'Submarine',
            length: 3,
            placed: null,
        },
        {
            name: 'Patrol Boat',
            length: 2,
            placed: null,
        },
    ]


    const [gameState, setGameState] = useState('placement');
    const [winner, setWinner] = useState(null);

    const [currentlyPlacing, setCurrentlyPlacing] = useState(null);
    const [placedShips, setPlacedShips] = useState([]);
    const [ships, setShips] = useState(SHIPS);
    const [enemyShips, setEnemyShips] = useState([]);
    const [hitsByPlayer, setHitsByPlayer] = useState([]);
    const [hitsByEnemy, setHitsByEnemy] = useState([]);
    const [selectedOrientation, setSelectedOrientation] = useState('vertical');
    const [gameStarted, setGameStarted] = useState(false);

    const selectShip = (shipName) => {
        let shipIdx = ships.findIndex((ship) => ship.name === shipName);
        const shipToPlace = ships[shipIdx];

        setCurrentlyPlacing({
            ...shipToPlace,
            orientation: selectedOrientation,
            position: null,
        });
    };

    const placeShip = (currentlyPlacing) => {
        setPlacedShips([
            ...placedShips,
            {
                ...currentlyPlacing,
                placed: true,
            },
        ]);

        setShips((previousShips) =>
            previousShips.filter((ship) => ship.name !== currentlyPlacing.name)
        );

        setCurrentlyPlacing(null);
    };

    const rotateShip = (orientation) => {
        setSelectedOrientation(orientation);
        if (currentlyPlacing != null) {
            setCurrentlyPlacing({
                ...currentlyPlacing,
                orientation,
            });
        }
    };

    const startTurn = () => {
        generateEnemyShips();
        setGameState('player-turn');
        setGameStarted(true)
    };

    const changeTurn = () => {
        setGameState((oldGameState) =>
            oldGameState === 'player-turn' ? 'enemy-turn' : 'player-turn'
        );
    };

    const generateEnemyShips = () => {
        let placedEnemyShips = placeAllEnemyShips(SHIPS.slice());
        setEnemyShips(placedEnemyShips);
    };

    const enemyFire = (index, layout) => {
        let enemyHits;

        if (layout[index] === 'ship') {
            enemyHits = [
                ...hitsByEnemy,
                {
                    position: indexToCoords(index),
                    type: SQUARE_STATE.hit,
                },
            ];
        }
        if (layout[index] === 'empty') {
            enemyHits = [
                ...hitsByEnemy,
                {
                    position: indexToCoords(index),
                    type: SQUARE_STATE.miss,
                },
            ];
        }
        const sunkShips = updateSunkShips(enemyHits, placedShips);
        const sunkShipsAfter = sunkShips.filter((ship) => ship.sunk).length;
        const sunkShipsBefore = placedShips.filter((ship) => ship.sunk).length;
        if (sunkShipsAfter > sunkShipsBefore) {
            playSound('sunk');
        }
        setPlacedShips(sunkShips);
        setHitsByEnemy(enemyHits);
    };

    const handleEnemyTurn = () => {
        changeTurn();

        if (checkIfGameOver()) {
            return;
        }

        let layout = placedShips.reduce(
            (prevLayout, currentShip) =>
                putEntityInLayout(prevLayout, currentShip, SQUARE_STATE.ship),
            generateEmptyLayout()
        );

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

        let successfulEnemyHits = hitsByEnemy.filter((hit) => hit.type === 'hit');

        let nonSunkEnemyHits = successfulEnemyHits.filter((hit) => {
            const hitIndex = coordsToIndex(hit.position);
            return layout[hitIndex] === 'hit';
        });

        let potentialTargets = nonSunkEnemyHits
            .flatMap((hit) => getNeighbors(hit.position))
            .filter((idx) => layout[idx] === 'empty' || layout[idx] === 'ship');

        if (potentialTargets.length === 0) {
            let layoutIndices = layout.map((item, idx) => idx);
            potentialTargets = layoutIndices.filter(
                (index) => layout[index] === 'ship' || layout[index] === 'empty'
            );
        }

        let randomIndex = generateRandomIndex(potentialTargets.length);

        let target = potentialTargets[randomIndex];

        setTimeout(() => {
            enemyFire(target, layout);
            changeTurn();
        }, 300);
    };


    const checkIfGameOver = () => {
        let successfulPlayerHits = hitsByPlayer.filter((hit) => hit.type === 'hit').length;
        let successfulEnemyHits = hitsByEnemy.filter((hit) => hit.type === 'hit').length;

        if (successfulEnemyHits === 17 || successfulPlayerHits === 17) {
            setTimeout(() => {
                setGameState('game-over');

                if (successfulEnemyHits === 17) {
                    setWinner('enemy');
                    playSound('lose');
                }
                if (successfulPlayerHits === 17) {
                    setWinner('player');
                    playSound('win');
                }
            }, 0);

            return true;
        }

        return false;
    };

    const startAgain = () => {
        setGameStarted(false)
        setGameState('placement');
        setWinner(null);
        setCurrentlyPlacing(null);
        setPlacedShips([]);
        setShips(SHIPS);
        setEnemyShips([]);
        setHitsByPlayer([]);
        setHitsByEnemy([]);
    };

    const sunkSoundRef = useRef(null);
    const clickSoundRef = useRef(null);
    const lossSoundRef = useRef(null);
    const winSoundRef = useRef(null);

    const stopSound = (sound) => {
        sound.current?.pause();
        sound.current.currentTime = 0;
    };
    const playSound = (sound) => {
        const playAudio = (audioRef) => {
            stopSound(audioRef);
            audioRef.current?.play().catch((error) => console.error(error));
        };

        if (sound === 'sunk') {
            playAudio(sunkSoundRef);
        } else if (sound === 'click') {
            playAudio(clickSoundRef);
        } else if (sound === 'lose') {
            playAudio(lossSoundRef);
        } else if (sound === 'win') {
            playAudio(winSoundRef);
        }
    };

    return (
        <GameContext.Provider value={{
            ships,
            selectShip,
            currentlyPlacing,
            setCurrentlyPlacing,
            rotateShip,
            placeShip,
            placedShips,
            startTurn,
            enemyShips,
            gameState,
            changeTurn,
            hitsByPlayer,
            setHitsByPlayer,
            hitsByEnemy,
            setHitsByEnemy,
            handleEnemyTurn,
            checkIfGameOver,
            startAgain,
            winner,
            setEnemyShips,
            playSound,
            sunkSoundRef,
            clickSoundRef,
            lossSoundRef,
            winSoundRef,
            selectedOrientation,
            setGameStarted,
            gameStarted
        }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGameContext = () => {
    return useContext(GameContext);
};
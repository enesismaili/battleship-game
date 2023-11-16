import React from 'react';
import { useGameContext } from '../context/GameContext';
import { PlayerStats } from '../components/game-components/PlayerStats';
import { PlayerFleet } from '../components/game-components/PlayerFleet';
import { Player } from '../components/game-components/Player';
import { Enemy } from '../components/game-components/Enemy';

export const Game = () => {
    const {
        sunkSoundRef,
        clickSoundRef,
        lossSoundRef,
        winSoundRef,
        gameState,
    } = useGameContext();

    return (
        <>
            <audio
                ref={sunkSoundRef}
                src="/sounds/ship_sunk.wav"
                className="clip"
                preload="auto"
            />
            <audio
                ref={clickSoundRef}
                src="/sounds/click.wav"
                className="clip"
                preload="auto"
            />
            <audio
                ref={lossSoundRef}
                src="/sounds/lose.wav"
                className="clip"
                preload="auto"
            />
            <audio
                ref={winSoundRef}
                src="/sounds/win.wav"
                className="clip"
                preload="auto"
            />
            <section className="flex flex-col xl:flex-row items-center">
                <PlayerFleet className="mb-4 xl:mb-0 xl:mr-4" />
                <Player className="mb-4 xl:mb-0 xl:mr-4" />
                <Enemy className="mb-4 xl:mb-0 xl:mr-4" />
                {gameState !== 'placement' && <PlayerStats />}
            </section>
        </>
    );
};

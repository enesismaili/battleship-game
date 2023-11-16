import React from 'react';
import { useGameContext } from '../../context/GameContext';

export const PlayerStats = () => {
    const {
        hitsByPlayer,
        hitsByEnemy,
        startAgain,
        winner,
    } = useGameContext();
    let numberOfHits = hitsByPlayer?.length;
    let numberOfSuccessfulHits = hitsByPlayer?.filter((hit) => hit.type === 'hit')?.length;
    let accuracyScore = Math.round(100 * (numberOfSuccessfulHits / numberOfHits));
    let successfulEnemyHits = hitsByEnemy?.filter((hit) => hit.type === 'hit')?.length;

    let gameOverPanel = (
        <div className={`text-center ${winner === 'player' && 'bg-green-400' || winner === 'enemy' && 'bg-red-400'} w-40 p-4 rounded-md`}>
            <div className="text-xl uppercase font-medium text-customColor">Game Over!</div>
            <p className="font-bold mt-2 text-gray-700">
                {winner === 'player' ? `Congratulations, You win the game!` : 'Unfortunately, You lost the game! '}
            </p>
            <p className="cursor-pointer text-customColor font-bold  mt-2 hover:bg-customColor hover:p-1 hover:text-sm hover:font-light hover:rounded hover:text-white" onClick={startAgain}>
                Play again?
            </p>
        </div>
    );

    let tipsPanel = (
        <div className="text-center w-52 bg-gray-300 p-4 rounded-md">
            <div className="text-customColor uppercase text-lg font-bold">Stats</div>
            <div className="text-base mt-4 uppercase font-bold ">Successfully hits</div>
            <div className="text-xl font-bold ">{numberOfSuccessfulHits}</div>
            <div className="text-base mt-4 uppercase font-bold ">Accuracy</div>
            <div className="text-xl font-bold ">{accuracyScore > 0 ? `${accuracyScore}%` : `0%`}</div>
            <div className="mt-4">
                <p className="font-regular mt-2 text-gray-700">The first to sink all 5 opponent ships wins.</p>
                <p className="cursor-pointer text-customColor font-bold  mt-2 hover:bg-customColor hover:p-1 hover:text-sm hover:font-light hover:rounded hover:text-white" onClick={startAgain}>
                    Restart
                </p>
            </div>
        </div>
    );

    return (
        <div className="w-48 max-h-96 p-4 font-headlines text-center self-center flex flex-col items-center justify-center">
            {numberOfSuccessfulHits === 17 || successfulEnemyHits === 17
                ? gameOverPanel
                : tipsPanel}
        </div>
    );
};

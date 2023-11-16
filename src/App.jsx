import React from 'react';
import {Route, Routes } from "react-router-dom";

import {Header} from "./components/Header";
import {Home} from "./components/Home";
import {Game} from "./game/Game";

const App = () => {
    return (
        <>
            <Header/>
            <div className="mt-16">
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/game' element={<Game />} />
                </Routes>
            </div>

        </>

    );
};

export default App;

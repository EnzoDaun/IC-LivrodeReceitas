import React from 'react';
import {Navigate, Route, Routes} from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import EbookPage from '../pages/EbookPage';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage/>}/>
            <Route path="/ebook" element={<EbookPage/>}/>
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="*" element={<Navigate to="/" replace/>}/>
        </Routes>
    );
};

export default AppRoutes;

import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import EbookPage from '@/pages/EbookPage';
import FavoritesPage from '@/pages/FavoritesPage';
import ChefDashboardPage from '@/pages/ChefDashboardPage';
import AddRecipePage from '@/pages/AddRecipePage';
import SobreNosPage from '@/pages/SobreNosPage';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/ebook" element={<EbookPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/favoritas" element={<FavoritesPage />} />
            <Route path="/receitas" element={<ChefDashboardPage />} />
            <Route path="/receitas/adicionar" element={<AddRecipePage />} />
            <Route path="/sobre" element={<SobreNosPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRoutes;
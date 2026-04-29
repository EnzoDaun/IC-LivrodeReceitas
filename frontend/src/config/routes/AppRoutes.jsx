import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import EbookPage from '@/pages/EbookPage';
import FavoritesPage from '@/pages/FavoritesPage';
import RecipesEntryPage from '@/pages/RecipesEntryPage';
import RecipeDetailPage from '@/pages/RecipeDetailPage';
import AddRecipePage from '@/pages/AddRecipePage';
import EditRecipePage from '@/pages/EditRecipePage';
import SobreNosPage from '@/pages/SobreNosPage';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AdminRoute from '@/components/auth/AdminRoute';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/nossa-historia" element={<EbookPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
                path="/favoritas"
                element={(
                    <ProtectedRoute>
                        <FavoritesPage />
                    </ProtectedRoute>
                )}
            />
            <Route
                path="/receitas"
                element={<RecipesEntryPage />}
            />
            <Route
                path="/receitas/adicionar"
                element={(
                    <ProtectedRoute>
                        <AdminRoute>
                            <AddRecipePage />
                        </AdminRoute>
                    </ProtectedRoute>
                )}
            />
            <Route
                path="/receitas/:recipeId/editar"
                element={(
                    <ProtectedRoute>
                        <AdminRoute>
                            <EditRecipePage />
                        </AdminRoute>
                    </ProtectedRoute>
                )}
            />
            <Route path="/receitas/:recipeId" element={<RecipeDetailPage />} />
            <Route path="/sobre" element={<SobreNosPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRoutes;

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Pages/Home";
import Recipes from "./Pages/Recipes";
import RecipeDetails from "./Pages/RecipeDetails";
import Header from "./Modules/Header";
import Footer from "./Modules/Footer";
import NotFoundPage from "./Pages/NotFoundPage";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import UserPage from "./Pages/UserPage";
import SavedRecipes from "./Pages/SavedRecipes";
import FollowedRecipes from "./Pages/FollowedRecipes";
import AddRecipe from "./Pages/AddRecipe";
import { useEffect } from "react";
import ApiService from "./ApiService";
import EditRecipe from "./Pages/EditRecipe";

function App() {  
    const ProtectedRoute = ({ children }) => {
        const token = localStorage.getItem("token");

        if (!token) {
            return <Navigate to="/" replace />;
        }

        return children;
    };

    const NotLoggedInRoute = ({ children }) => {
        const token = localStorage.getItem("token");

        if (token) {
            return <Navigate to="/" replace />;
        }

        return children;
    }

    return(
        <BrowserRouter>
            <div className="app">
                <Header />
                <main className="content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/recipes" element={<Recipes />} />
                        <Route path="/recipes/:id" element={<RecipeDetails />} />
                        <Route path="/404" element={<NotFoundPage />} />
                        <Route path="/login" element={
                            <NotLoggedInRoute>
                                <Login />
                            </NotLoggedInRoute>
                        } />
                        <Route path="/register" element={
                            <NotLoggedInRoute>
                                <Register />
                            </NotLoggedInRoute>
                        } />
                        <Route path="/user/:username" element={<UserPage />} />
                        <Route path="/saved" element={
                            <ProtectedRoute>
                                <SavedRecipes />
                            </ProtectedRoute>
                            } />
                        <Route path="/followed" element={
                            <ProtectedRoute>
                                <FollowedRecipes />
                            </ProtectedRoute>
                            } />
                        <Route path="/add-recipe" element={
                            <ProtectedRoute>
                                <AddRecipe />
                            </ProtectedRoute>
                        } />
                        <Route path="/recipes/:id/edit" element={
                            <ProtectedRoute>
                                <EditRecipe />
                            </ProtectedRoute>
                        } />
                    </Routes>
                </main>
                <Footer />
            </div>
        </BrowserRouter>
    );
}

export default App

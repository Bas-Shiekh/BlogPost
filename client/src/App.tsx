"use client";

import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./hooks";
import type { RootState } from "./store";
import { setTheme } from "./store/slices/themeSlice";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import BlogsPage from "./pages/BlogsPage";
import BlogDetailPage from "./pages/BlogDetailPage";
import NewBlogPage from "./pages/NewBlogPage";
import EditBlogPage from "./pages/EditBlogPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import { Toaster } from "./components/ui/Toaster";

/**
 * Main App component
 */
function App() {
  const dispatch = useAppDispatch();
  const { theme } = useAppSelector((state: RootState) => state.theme);

  // Apply theme on initial load
  useEffect(() => {
    dispatch(setTheme(theme));
  }, [dispatch, theme]);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/blogs" element={<BlogsPage />} />
          <Route path="/blogs/:id" element={<BlogDetailPage />} />
          <Route path="/blogs/new" element={<NewBlogPage />} />
          <Route path="/blogs/edit/:id" element={<EditBlogPage />} />
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </Layout>
      <Toaster />
    </Router>
  );
}

export default App;

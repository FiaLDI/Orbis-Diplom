import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "@/pages/Home/components/Layout/Layout";
import { useAppSelector } from "@/app/hooks";
import { Component as HomePage } from "@/pages/Home/index";
import { Component as PoliticalPage } from "@/pages/Political";
import { AuthPage } from "@/pages/Auth";
import { Component as CommunicatePage } from "@/pages/Communicate";
import { SettingsPage } from "@/pages/Settings";
import { useRefreshTokenMutation } from "@/features/auth";
import { ProtectedRoute } from "./utils/auth";
import { LoadingSpinner } from "@/shared";

export const PagesRouter: React.FC = () => {
  const isAuth = useAppSelector((state) => state.auth.isAuthenticated) || false;
  const [refresh] = useRefreshTokenMutation({});
  const [isRefreshing, setIsRefreshing] = useState<boolean>(true);

  const refreshToken = async () => {
    try {
      await refresh({}).unwrap();
    } catch (error) {
      console.error("Refresh failed:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    refreshToken();
  }, []);

  if (isRefreshing) {
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <LoadingSpinner className="w-[300px] h-[300px]" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <HomePage />
            </Layout>
          }
        />
        <Route
          path="/login"
          element={
            <ProtectedRoute isAuth={!isAuth} path="/app">
              <AuthPage type="login" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRoute isAuth={!isAuth} path="/app">
              <AuthPage type="register" />
            </ProtectedRoute>
          }
        />

        <Route
          path="/political"
          element={
            <Layout>
              <PoliticalPage />
            </Layout>
          }
        />

        <Route
          path="/app/settings"
          element={
            <ProtectedRoute isAuth={isAuth}>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/app"
          element={
            <ProtectedRoute isAuth={isAuth}>
              <CommunicatePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

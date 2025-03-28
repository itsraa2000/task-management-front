import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import { AuthProvider } from "./contexts/AuthProvider";
import Header from "./components/header";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import CalendarPage from "./pages/Calendar";
import CollaborationsPage from "./pages/Collaboration";
import "./App.css";
import { Toaster } from "react-hot-toast";
import BoardSelectionPage from "./pages/Boardselection";
import BoardsPage from "./pages/Boards";
import NotFoundPage from "./pages/NotFoundPage";
import { useAuth } from "./contexts/useAuth";
import { ProtectedRoute } from "./components/ProtectedRoutes";
import DashboardPage from "./pages/Dashboard";

function AppContent() {
  const { isAuthenticated } = useAuth(); // Now it's inside AuthProvider!

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Toaster position="top-right" />
        <Routes>
          {/* Public routes */}
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <LoginPage />
              )
            }
          />
          <Route
            path="/register"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <RegisterPage />
              )
            }
          />
          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/calendar"
            element={
              <ProtectedRoute>
                <CalendarPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/collaborations"
            element={
              <ProtectedRoute>
                <CollaborationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/board-selection"
            element={
              <ProtectedRoute>
                <BoardSelectionPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/boards/:boardId"
            element={
              <ProtectedRoute>
                <BoardsPage />
              </ProtectedRoute>
            }
          />
          {/* Redirect root to dashboard or login */}
          <Route
            path="/"
            element={
              <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
            }
          />
          {/* 404 page */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <AuthProvider>
          {" "}
          {/* Now AppContent is inside AuthProvider */}
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "./components/theme-provider"
import { AuthProvider } from "./contexts/AuthProvider"
import Header from "./components/header"
import Home from "./pages/Home"
import LoginPage from "./pages/Login"
import RegisterPage from "./pages/Register"
import CalendarPage from "./pages/Calendar"
import CollaborationsPage from "./pages/Collaboration"
import "./App.css"

function App() {
  return (
    <Router>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/collaborations" element={<CollaborationsPage />} />
              </Routes>
            </main>
          </div>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  )
}

export default App
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { lazy, useEffect, useState } from "react";
import Sidebar from "./component/Sidebar";
import Correlations from "./pages/Corelations";
import AuthForm from "./pages/Authform";

const LandingPage = lazy(() => import("./pages/LandingPage"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Chatscreen = lazy(() => import("./pages/Chatscreen"));
const KnowledgeGraphScreen = lazy(() => import("./pages/KnowledgeGraphScreen"));
const TextExtraction = lazy(() => import("./pages/TextExtraction"));
const Statistics = lazy(() => import("./pages/StatisticsDashboard"));

function App() {
  const [showSiderbar, setShowSiderbar] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    function handleLogin() {
      setShowSiderbar(true);
    }
    window.addEventListener("login", handleLogin);

    return () => window.removeEventListener("login", handleLogin);
  }, []);

  useEffect(() => {
    function handleLogout() {
      setShowSiderbar(false);
    }
    window.addEventListener("logout", handleLogout);

    return () => window.removeEventListener("logout", handleLogout);
  }, []);

  return (
    <Router>
      <div className='flex'>
        {showSiderbar && <Sidebar /> }
        <div className={`w-full ${showSiderbar ? "ml-64": "ml-0"}`}>    
        <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<AuthForm />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/chat" element={<Chatscreen />} />
              <Route path="/knowledgegraph" element={<KnowledgeGraphScreen />} />
              <Route path="/corelations" element={<Correlations />} />
              <Route path="/extract" element={<TextExtraction />} />
              <Route path="/statistics" element={<Statistics />} />
              {/* <Route path="/statistics" element={<StatisticsDashboard />} /> */}

              <Route path="*" element={<h1 className="text-center mt-10">404 - Not Found</h1>} />
            </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App

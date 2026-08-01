import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import Study from "./pages/Study";
import Goals from "./pages/Goals";
import Profile from "./pages/Profile";
import AIAssistant from "./pages/AIAssistant";
import QuizPage from "./pages/QuizPage";
import QuizResultPage from "./pages/QuizResultPage";
import QuizReviewPage from "./pages/QuizReviewPage";
function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/study"
        element={
          <ProtectedRoute>
            <Study />
          </ProtectedRoute>
        }
      />
      <Route
        path="/goals"
        element={
          <ProtectedRoute>
            <Goals />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ai"
        element={
          <ProtectedRoute>
            <AIAssistant />
          </ProtectedRoute>
        }
      />
      <Route path="/quiz/:studyId" element={<ProtectedRoute><QuizPage /></ProtectedRoute>} />
      <Route path="/quiz/:studyId/result" element={<ProtectedRoute><QuizResultPage /></ProtectedRoute>} />
      <Route path="/quiz/:studyId/review" element={<ProtectedRoute><QuizReviewPage /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import Login from './components/Auth/Login';
import Dashboard from './components/Dashboard/Dashboard';
import QuizList from './components/Quiz/QuizList';
import QuizEditor from './components/Quiz/QuizEditor';
import QuizTaking from './components/Quiz/QuizTaking';
import QuizResult from './components/Quiz/QuizResult';
import AdminDashboard from './components/Admin/AdminDashboard';
import Analytics from './components/Analytics/Analytics';
import Navbar from './components/Layout/Navbar';
import { Toaster } from './components/UI/Toaster';

function App() {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Login />
        <Toaster />
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navbar />
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/quizzes" element={<QuizList />} />
            
            {/* Quiz routes */}
            <Route path="/quiz/take/:id" element={<QuizTaking />} />
            <Route path="/quiz/result/:id" element={<QuizResult />} />
            
            {/* Instructor/Admin routes */}
            {(user?.role === 'admin' || user?.role === 'instructor') && (
              <>
                <Route path="/quiz/new" element={<QuizEditor />} />
                <Route path="/quiz/edit/:id" element={<QuizEditor />} />
                <Route path="/analytics" element={<Analytics />} />
              </>
            )}
            
            {/* Admin-only routes */}
            {user?.role === 'admin' && (
              <Route path="/admin" element={<AdminDashboard />} />
            )}
            
            {/* Redirect unknown routes */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
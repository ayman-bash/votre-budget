import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import AuthForm from './auth';
import Home from './pages/home';
import ProtectedRoute from './composants/ProtectedRoute';
import Revenues from './pages/Revenues';
import Expenses from './pages/Expenses';
import Investments from './pages/Investments';
import Dashboard from './pages/Dashbord';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers'; 
import AdminRevenues from './pages/AdminRevenues';
import AdminExpenses from './pages/AdminExpenses';
import AdminInvestments from './pages/AdminInvestments';
function App() {
  return (
    <Router>
      <div>
        <Routes>

          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<AuthForm />} />

          {/* Protected Routes pour utilisateurs */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/revenues" element={<Revenues />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/investments" element={<Investments />} />
          </Route>

          {/* Routes Admin - Accessibles uniquement après redirection depuis ProtectedRoute */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/revenues" element={<AdminRevenues />} />
          <Route path="/admin/expenses" element={<AdminExpenses />} />
          <Route path="/admin/investments" element={<AdminInvestments />} />

          {/* 404 Route */}
          <Route path="*" element={<h1>404 - Page non trouvée</h1>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

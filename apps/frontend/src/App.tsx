import { Routes, Route, Navigate } from "react-router";
import { ProtectedRoute, PublicOnlyRoute } from './components/RouteGuards';
import { AuthProvider } from './context/AuthContext';
import Layout from "./Layout";

{/* Page Imports */}
import HomePage from './pages/home/HomePage';
import CreateProjectPage from './pages/create_project/CreateProjectPage';
import ProjectPage from './pages/project/ProjectPage';
import TaskPage from './pages/task/TaskPage';
import Register from './pages/register/Register';
import Login from './pages/login/Login';
import AccountPage from './pages/account/AccountPage';

const App = () => {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          <Route element={<PublicOnlyRoute />}>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/create-project" element={<CreateProjectPage />} />
            <Route path="/projects/:projectId" element={<ProjectPage />} />
            <Route path="/tasks/:taskId" element={<TaskPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </AuthProvider>
  );
};

export default App;
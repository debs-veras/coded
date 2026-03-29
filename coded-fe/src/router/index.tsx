import React, { Suspense, lazy } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import PageLoader from '../components/PageLoader';
import { ProtectedRoute, RoleProtectedRoute } from './ProtectedRoute';

const AdminLayout = lazy(() => import('../layouts/AdminLayout'));
const Home = React.lazy(() => import('../pages/Home'));
const Login = React.lazy(() => import('../pages/Login'));
const NotFound = lazy(() => import('../pages/NotFound'));

const UserForm = lazy(() => import('../pages/Users/form'));
const UserListing = lazy(() => import('../pages/Users/listing'));
const ClassForm = lazy(() => import('../pages/Classes/form'));
const ClassListing = lazy(() => import('../pages/Classes/listing'));

// Atividades - Professor
const TeacherActivityListing = lazy(() => import('../pages/Activities/Teacher/Listing'));
const TeacherActivityForm = lazy(() => import('../pages/Activities/Teacher/Form'));
const TeacherCorrections = lazy(() => import('../pages/Activities/Teacher/Corrections'));

// Atividades - Aluno
const StudentActivityListing = lazy(() => import('../pages/Activities/Student/Listing'));
const StudentResponseForm = lazy(() => import('../pages/Activities/Student/Response'));
const StudentHistory = lazy(() => import('../pages/Activities/Student/History'));
const StudentDashboard = lazy(() => import('../pages/Activities/Student/Dashboard'));

function Router(): React.JSX.Element {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />,
    },
    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '/',
      element: (
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: 'user/form/:id?',
          element: (
            <RoleProtectedRoute allowedRoles={['ADMIN']}>
              <UserForm />
            </RoleProtectedRoute>
          ),
        },
        {
          path: 'users',
          element: (
            <RoleProtectedRoute allowedRoles={['ADMIN']}>
              <UserListing />
            </RoleProtectedRoute>
          ),
        },
        {
          path: 'turma/form/:id?',
          element: (
            <RoleProtectedRoute allowedRoles={['ADMIN', 'TEACHER']}>
              <ClassForm />
            </RoleProtectedRoute>
          ),
        },
        {
          path: 'turmas',
          element: (
            <RoleProtectedRoute allowedRoles={['ADMIN', 'TEACHER']}>
              <ClassListing />
            </RoleProtectedRoute>
          ),
        },
        // Atividades - Professor
        {
          path: 'atividades',
          element: (
            <RoleProtectedRoute allowedRoles={['TEACHER']}>
              <TeacherActivityListing />
            </RoleProtectedRoute>
          ),
        },
        {
          path: 'atividades/form/:id?',
          element: (
            <RoleProtectedRoute allowedRoles={['TEACHER']}>
              <TeacherActivityForm />
            </RoleProtectedRoute>
          ),
        },
        {
          path: 'atividades/:id/respostas',
          element: (
            <RoleProtectedRoute allowedRoles={['TEACHER']}>
              <TeacherCorrections />
            </RoleProtectedRoute>
          ),
        },
        // Atividades - Aluno
        {
          path: 'dashboard',
          element: (
            <RoleProtectedRoute allowedRoles={['STUDENT']}>
              <StudentDashboard />
            </RoleProtectedRoute>
          ),
        },
        {
          path: 'atividades/turma',
          element: (
            <RoleProtectedRoute allowedRoles={['STUDENT']}>
              <StudentActivityListing />
            </RoleProtectedRoute>
          ),
        },
        {
          path: 'atividades/responder/:id',
          element: (
            <RoleProtectedRoute allowedRoles={['STUDENT']}>
              <StudentResponseForm />
            </RoleProtectedRoute>
          ),
        },
        {
          path: 'respostas/historico',
          element: (
            <RoleProtectedRoute allowedRoles={['STUDENT']}>
              <StudentHistory />
            </RoleProtectedRoute>
          ),
        },
      ],
    },
    {
      path: '*',
      element: <NotFound />,
    },
  ]);

  return (
    <Suspense fallback={<PageLoader />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default Router;

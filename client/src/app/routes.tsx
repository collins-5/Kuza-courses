import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthLayout from '@/components/layouts/auth-layout';
import MainLayout from '@/components/layouts/main-layout';
import ProtectedRoute from '@/components/core/protected-route';
import Home from '@/pages/home';
import Login from '@/pages/auth/login';
import Register from '@/pages/auth/register';
import CourseDetail from '@/pages/course-detail';
import CourseEdit from '@/pages/course-edit';
import CourseCreate from '@/pages/create-course';
import Providers from './providers';
import CoursesBrowse from '@/pages/courses';

export default function AppRoutes() {
  return (
    <Providers>
      <BrowserRouter>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<CoursesBrowse />} />
            <Route path="/courses/:id" element={<CourseDetail />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/courses/create" element={<CourseCreate />} />
              <Route path="/courses/:id/edit" element={<CourseEdit />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </Providers>
  );
}
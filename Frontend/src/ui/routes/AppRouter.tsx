import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import { GroceryListPage } from '@/ui/pages/GroceryListPage/GroceryListPage'
import { LoginPage } from '@/ui/pages/LoginPage/LoginPage'
import { RegisterPage } from '@/ui/pages/RegisterPage/RegisterPage'
import { ProtectedRoute } from './ProtectedRoute'
import { PublicOnlyRoute } from './PublicOnlyRoute'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<GroceryListPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

import { Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import AnnouncementBar from './components/AnnouncementBar'
import Header from './components/Header'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import ManifestoPage from './pages/ManifestoPage'
import AdminLayout from './pages/admin/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import Products from './pages/admin/Products'
import ProductForm from './pages/admin/ProductForm'
import BannerManager from './pages/admin/BannerManager'

function ScrollTop() { const { pathname } = useLocation(); useEffect(() => { window.scrollTo(0, 0) }, [pathname]); return null }

function Storefront() {
  return (<><AnnouncementBar /><Header /><main><Outlet /></main><Footer /><CartDrawer /></>)
}

export default function App() {
  return (
    <>
      <ScrollTop />
      <Routes>
        <Route element={<Storefront />}>
          <Route index element={<Home />} />
          <Route path="tienda" element={<Shop />} />
          <Route path="producto/:id" element={<ProductDetail />} />
          <Route path="manifiesto" element={<ManifestoPage />} />
          <Route path="*" element={<div className="container-x py-32 text-center font-display text-2xl">Página no encontrada</div>} />
        </Route>
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="productos" element={<Products />} />
          <Route path="productos/nuevo" element={<ProductForm />} />
          <Route path="productos/:id" element={<ProductForm />} />
          <Route path="banner" element={<BannerManager />} />
        </Route>
      </Routes>
    </>
  )
}

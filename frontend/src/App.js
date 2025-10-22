import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import AdminPage from './pages/AdminPage';
import CategoryPage from './pages/CategoryPage';
import SearchResults from './pages/SearchResults';
import UserManagementPage from './pages/UserManagementPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/users" element={<UserManagementPage />} />
          <Route path="/search" element={<SearchResults />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
         <Route path="/category/:categoryName" element={<CategoryPage />} />
      </Routes>
    </Router>
  );
}

export default App;

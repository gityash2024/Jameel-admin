import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminLayout from './components/layout/AdminLayout';

// Pages
import Dashboard from './pages/Dashboard';
import User from './pages/User';
import AddUser from './pages/AddUser';
import AllUser from './pages/AllUser';
import RoleUser from './pages/RoleUser';
import Products from './pages/Products';
import AddProduct from './pages/AddProduct';
import AllProduct from './pages/AllProduct';
import AttributeProduct from './pages/AttributeProduct';
import CategoryProduct from './pages/Categoryproduct';
import TgsProduct from './pages/TgsProduct';
import OrderAll from './pages/OrderAll';
import CreateOrder from './pages/CreateOrder';
import Media from './pages/Media';
import Blogs from './pages/Blogs';
import AddBlogs from './pages/AllBLogs';
import BlogCategroy from './pages/BlogCategroy';
import BlogTag from './pages/BlogTag';
import Taxies from './pages/Taxies';
import Shipping from './pages/Shipping';
import Coupons from './pages/Coupons';
import Currencies from './pages/Currencies';
import Review from './pages/Review';
import Faqs from './pages/FAQ';
import Orders from './pages/Orders';
import Customers from './pages/Customers';
import Settings from './pages/Settings';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="products/all" element={<AllProduct />} />
          <Route path="products/attribute" element={<AttributeProduct />} />
          <Route path="products/category" element={<CategoryProduct />} />
          <Route path="products/tgs" element={<TgsProduct />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders/all" element={<OrderAll />} />
          <Route path="orders/create" element={<CreateOrder />} />
          <Route path="media" element={<Media />} />
          <Route path="blogs" element={<Blogs />} />
          <Route path="blogs/add" element={<AddBlogs />} />
          <Route path="blogs/category" element={<BlogCategroy />} />
          <Route path="blogs/tag" element={<BlogTag />} />
          <Route path="taxies" element={<Taxies />} />
          <Route path="shipping" element={<Shipping />} />
          <Route path="coupons" element={<Coupons />} />
          <Route path="currencies" element={<Currencies />} />
          <Route path="review" element={<Review />} />
          <Route path="faqs" element={<Faqs />} />
          <Route path="users" element={<User />} />
          <Route path="users/add" element={<AddUser />} />
          <Route path="users/all" element={<AllUser />} />
          <Route path="users/role" element={<RoleUser />} />
          <Route path="customers" element={<Customers />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
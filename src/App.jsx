import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AdminLayout from './components/layout/AdminLayout';
import AuthGuard from './components/common/AuthGuard';
import Dashboard from './pages/Dashboard';
import User from './pages/User';
import AddUser from './pages/AddUser';
import AllUser from './pages/AllUser';
import RoleUser from './pages/RoleUser';
import SupportTicketsPage from './pages/SupportTickets';

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
import Sales from './pages/Sales';
import SaleDetails from './pages/SaleDetails';
import SaleProductlist from './pages/SaleProductlist';
import SaleOver from './pages/SaleOver';
import BookInStoreAppointment from './pages/BookInStoreAppointment';
import FindNearbyStore from './pages/FindNearbyStore';
import ViewDetails from './pages/ViewDetails';
import Signup from './pages/Signup';
import SubCategoryProduct from './pages/SubCategoryProduct';

function App() {
  return (
    <BrowserRouter>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />
      
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        <Route path="/" element={<AuthGuard><AdminLayout /></AuthGuard>}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="/products/edit/:id" element={<AddProduct />} />
          <Route path="support-tickets" element={<SupportTicketsPage />} />

          <Route path="products/all" element={<AllProduct />} />
          <Route path="products/attribute" element={<AttributeProduct />} />
          <Route path="products/category" element={<CategoryProduct />} />
          <Route path="products/subcategory" element={<SubCategoryProduct />} />

          <Route path="products/tgs" element={<TgsProduct />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders/all" element={<OrderAll />} />
          <Route path="orders/create" element={<CreateOrder />} />
          <Route path="media" element={<Media />} />
          <Route path="blogs" element={<Blogs />} />
          <Route path="blogs/add" element={<AddBlogs />} />
          <Route path="blogs/category" element={<BlogCategroy />} />
          <Route path="blogs/tag" element={<BlogTag />} />
          {/* <Route path="taxies" element={<Taxies />} /> */}
          {/* <Route path="shipping" element={<Shipping />} /> */}
          <Route path="coupons" element={<Coupons />} />
          {/* <Route path="currencies" element={<Currencies />} /> */}
          {/* <Route path="review" element={<Review />} /> */}
          {/* <Route path="faqs" element={<Faqs />} /> */}
          <Route path="users" element={<User />} />
          <Route path="users/add" element={<AddUser />} />
          <Route path="users/all" element={<AllUser />} />
          <Route path="users/role" element={<RoleUser />} />
          <Route path="customers" element={<Customers />} />
          {/* <Route path="settings" element={<Settings />} /> */}
          <Route path="sales" element={<Sales />} />
          <Route path="sales/details" element={<SaleDetails />} />
          <Route path="sales/productlist" element={<SaleProductlist />} />
          <Route path="sales/over" element={<SaleOver />} />
          <Route path="book-in-store-appointment" element={<BookInStoreAppointment />} />
          <Route path="find-nearby-store" element={<FindNearbyStore />} />
          <Route path="view-details" element={<ViewDetails />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
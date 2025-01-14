import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Menu, Search, Globe, Maximize2, Languages, Bell, Sun, User } from 'lucide-react';
import styled from 'styled-components';
import welcomebackadmin from '../assets/welcomebackadmin.png';
import pending from '../assets/pending.png';
import processing from '../assets/processing.png';
import cancelled from '../assets/cancelled.png';
import shipped from '../assets/shipped.png';
import outofdelivery from '../assets/outofdelivery.png';
import deliverd from '../assets/deliverd.png';
import totalrevenue from '../assets/totalrevenue.png';
import totalproducts from '../assets/totalproducts.png';
import totalorders from '../assets/totalorders.png';
import totalusers from '../assets/totalusers.png';
import ring from '../assets/ring.png';
import jacket from '../assets/jacket.png';
import shacket from '../assets/shacket.png';

const DashboardContainer = styled.div`
  padding: 24px;
  background: #f5f5f5;
  min-height: 100vh;
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const SearchBar = styled.div`
  position: relative;
  
  input {
    padding: 8px 16px 8px 40px;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
    outline: none;
    width: 300px;
    
    &:focus {
      border-color: #2196f3;
      box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.1);
    }
  }
  
  svg {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #9e9e9e;
  }
`;

const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  
  button {
    padding: 8px 16px;
    border-radius: 6px;
    font-weight: 500;
    
    &.pos-btn {
      background: #000;
      color: white;
    }
  }
  
  .notification-badge {
    position: relative;
    
    span {
      position: absolute;
      top: -6px;
      right: -6px;
      background: #f44336;
      color: white;
      font-size: 12px;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
`;

const WelcomeSection = styled.div`
  position: relative;
  background: white;
  border-radius: 12px;
  padding: 24px;
  overflow: hidden;
  margin-bottom: 24px;
  
  .content {
    position: relative;
    z-index: 2;
    max-width: 60%;
    
    h1 {
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 8px;
    }
    
    p {
      color: #666;
      line-height: 1.5;
    }
  }
  
  .bg-image {
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    z-index: 1;
  }
`;

const StatusGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
  margin-bottom: 24px;
`;

// const StatusCard = styled.div`
//   background: white;
//   border-radius: 12px;
//   padding: 16px;
  
//   .status-content {
//     display: flex;
//     align-items: center;
//     gap: 12px;
    
//     img {
//       width: 32px;
//       height: 32px;
//     }
    
//     .stats {
//       .number {
//         font-size: 20px;
//         font-weight: 600;
//       }
      
//       .label {
//         font-size: 14px;
//         color: #666;
//       }
//     }
//   }
// `;

// const MetricsGrid = styled.div`
//   display: grid;
//   grid-template-columns: repeat(4, 1fr);
//   gap: 16px;
//   margin-bottom: 24px;
// `;

// const MetricCard = styled.div`
//   padding: 20px;
//   border-radius: 12px;
//   background: ${props => props.bgcolor || 'white'};
  
//   .metric-content {
//     display: flex;
//     align-items: center;
//     gap: 16px;
    
//     img {
//       width: 48px;
//       height: 48px;
//     }
    
//     .info {
//       h3 {
//         font-size: 24px;
//         font-weight: 600;
//         margin-bottom: 4px;
//       }
      
//       p {
//         color: #666;
//         font-size: 14px;
//       }
//     }
//   }
// `;

const ContentSection = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  
  h2 {
    font-size: 18px;
    font-weight: 600;
  }
  
  select {
    padding: 6px 12px;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    outline: none;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #e0e0e0;
  }
  
  th {
    color: #666;
    font-weight: 500;
    font-size: 14px;
  }
  
  td {
    font-size: 14px;
    
    &.with-image {
      display: flex;
      align-items: center;
      gap: 8px;
      
      img {
        width: 32px;
        height: 32px;
        border-radius: 4px;
        object-fit: cover;
      }
    }
  }
`;

const StatusBadge = styled.span`
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  
  &.in-stock {
    background: #e8f5e9;
    color: #2e7d32;
  }
  
  &.out-of-stock {
    background: #ffebee;
    color: #c62828;
  }
  
  &.pending {
    background: #fff3e0;
    color: #f57c00;
  }
  
  &.completed {
    background: #e8f5e9;
    color: #2e7d32;
  }
`;

const ReviewCard = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  
  img {
    width: 48px;
    height: 48px;
    border-radius: 8px;
    object-fit: cover;
  }
  
  .review-content {
    h3 {
      font-weight: 500;
      margin-bottom: 4px;
    }
    
    .user {
      color: #666;
      font-size: 14px;
      margin-bottom: 4px;
    }
    
    .stars {
      display: flex;
      gap: 4px;
      color: #ffc107;
    }
  }
`;

const ProductCard = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  
  .product-header {
    display: flex;
    gap: 16px;
    margin-bottom: 12px;
    
    img {
      width: 48px;
      height: 48px;
      border-radius: 8px;
      object-fit: cover;
    }
    
    .product-info {
      .date {
        color: #666;
        font-size: 12px;
        margin-bottom: 4px;
      }
      
      .name {
        font-weight: 500;
      }
    }
  }
  
  .product-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    
    .stat {
      .label {
        color: #666;
        font-size: 12px;
        margin-bottom: 4px;
      }
      
      .value {
        font-weight: 500;
      }
    }
  }
`;

const Footer = styled.footer`
  text-align: center;
  padding: 24px 0;
  color: #666;
`;


const WelcomeCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 24px;
  position: relative;
  overflow: hidden;
  margin-bottom: 24px;

  .content {
    max-width: 50%;
    position: relative;
    z-index: 2;
  }

  h1 {
    font-size: 24px;
    font-weight: 600;
    color: #111827;
    margin-bottom: 12px;
  }

  p {
    color: #4B5563;
    line-height: 1.5;
    font-size: 14px;
  }

  .background-image {
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    width: 50%;
    object-fit: cover;
  }
`;

const OrderStatusGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
  margin-bottom: 24px;
`;

const StatusCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;

  .status-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }

  .icon {
    width: 24px;
    height: 24px;

    &.pending { color: #F97316; }
    &.processing { color: #10B981; }
    &.cancelled { color: #EF4444; }
    &.shipped { color: #8B5CF6; }
    &.out-delivery { color: #3B82F6; }
    &.delivered { color: #14B8A6; }
  }

  .count {
    font-size: 24px;
    font-weight: 600;
    color: #111827;
  }

  .label {
    font-size: 14px;
    color: #6B7280;
  }
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
`;

const MetricCard = styled.div`
  padding: 20px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 16px;

  &.revenue { background: #F3F4F6; }
  &.products { background: #ECFDF5; }
  &.orders { background: #FCE7F3; }
  &.users { background: #FFF7ED; }

  .icon {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .content {
    .value {
      font-size: 24px;
      font-weight: 600;
      color: #111827;
      margin-bottom: 4px;
    }

    .label {
      font-size: 14px;
      color: #6B7280;
    }
  }
`;

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');

 

  const orderStatus = [
    { label: 'Pending', count: 12, icon: pending, color: 'pending' },
    { label: 'Processing', count: 0, icon: processing, color: 'processing' },
    { label: 'Cancelled', count: 1, icon: cancelled, color: 'cancelled' },
    { label: 'Shipped', count: 0, icon: shipped, color: 'shipped' },
    { label: 'Out for delivery', count: 0, icon: outofdelivery, color: 'out-delivery' },
    { label: 'Delivered', count: 3, icon: deliverd, color: 'delivered' }
  ];

  const metrics = [
    { label: 'Total Revenue', value: '$2,503.83', icon: totalrevenue, className: 'revenue' },
    { label: 'Total Products', value: '489', icon: totalproducts, className: 'products' },
    { label: 'Total Orders', value: '16', icon: totalorders, className: 'orders' },
    { label: 'Total User', value: '4', icon: totalusers, className: 'users' }
  ];


  const categories = [
    { name: 'Ring', orders: 4, earning: 281,},
    { name: 'Necklace', orders: 0, earning: 0 },
    { name: 'Bracelet', orders: 1, earning: 42 },
    { name: 'Engagement', orders: 0, earning: 0 },
    { name: 'Earrings', orders: 1, earning: 105 },
    { name: 'Wedding', orders: 0, earning: 0 }
  ];

  const revenueData = [
    { month: 'Jan 24', revenue: 0 },
    { month: 'Feb 24', revenue: 0 },
    { month: 'Mar 24', revenue: 0 },
    { month: 'Apr 24', revenue: 0 },
    { month: 'May 24', revenue: 0 },
    { month: 'Jun 24', revenue: 2400 },
    { month: 'Jul 24', revenue: 0 },
    { month: 'Aug 24', revenue: 0 },
    { month: 'Sep 24', revenue: 0 },
    { month: 'Oct 24', revenue: 0 },
    { month: 'Nov 24', revenue: 0 },
    { month: 'Dec 24', revenue: 0 }
  ];

  const recentOrders = [
    { number: '#1020', date: '6 Jul 2024', name: 'john due', amount: 61.73, status: 'PENDING' },
    { number: '#1017', date: '6 Jul 2024', name: 'john due', amount: 1.97, status: 'PENDING' },
    { number: '#1016', date: '26 Jun 2024', name: 'john due', amount: 46.14, status: 'PENDING' },
    { number: '#1015', date: '25 Jun 2024', name: 'john due', amount: 18.75, status: 'PENDING' },
    { number: '#1014', date: '25 Jun 2024', name: 'Rhoda Mayer', amount: 8.23, status: 'COMPLETED' },
    { number: '#1013', date: '24 Jun 2024', name: 'john due', amount: 1.72, status: 'PENDING' },
    { number: '#1012', date: '21 Jun 2024', name: 'john due', amount: 6.23, status: 'PENDING' }
  ];

  const stockItems = [
    { name: 'OPPO Reno Pro', quantity: 0, status: 'Out Of Stock', image: ring },
    { name: 'Palm Bliss Unleashed', quantity: 4, status: 'In Stock', image: ring },
    { name: 'Mustard Crop Top', quantity: 4, status: 'In Stock', image: ring },
    { name: 'Juicy Green Kiwi', quantity: 5, status: 'In Stock', image: ring },
    { name: 'OAK Coffee Table', quantity: 5, status: 'In Stock', image: ring },
    { name: 'Wooden Center Table', quantity: 5, status: 'In Stock', image: ring },
    { name: 'Deliciously Sweet Strawberry', quantity: 6, status: 'In Stock', image: ring },
    { name: 'Dog/Cat Teepee Tent', quantity: 8, status: 'In Stock', image: ring }
  ];

  const reviews = [
    { product: 'Classic Jacket', user: 'Rhoda Mayer', rating: 4, image: jacket },
    { product: 'Versatile Shacket', user: 'john due', rating: 5, image: shacket }
  ];

  const topProducts = [
    { date: '26 Jun 2024', name: 'Boyfriend Shirts', price: 10.56, orders: 1, stock: 27, amount: 31.52, image: ring },
    { date: '26 Jun 2024', name: 'Classic Jacket', price: 7.84, orders: 1, stock: 25, amount: 8.23, image: jacket },
    { date: '26 Jun 2024', name: 'Tan Cargo Shorts', price: 9.96, orders: 1, stock: 129, amount: 10.46, image: ring },
    { date: '26 Jun 2024', name: 'Stripped Bodycon Dress', price: 11.76, orders: 1, stock: 14, amount: 31.52, image: ring },
    { date: '26 Jun 2024', name: 'Versatile Shacket', price: 7.70, orders: 1, stock: 13, amount: 31.52, image: shacket }
  ];

  return (
    <DashboardContainer>

       <div className="min-h-screen bg-gray-50 p-6">
      <WelcomeCard>
        <div className="content">
          <h1>Welcome Back Admin</h1>
          <p>Manage application's data and operations with real time analytics, user management tools and customizable reports.</p>
        </div>
        <img src={welcomebackadmin} alt="Welcome" className="background-image" />
      </WelcomeCard>

      <OrderStatusGrid>
        {orderStatus.map((status, index) => (
          <StatusCard key={index}>
            <div className="status-header">
              <img src={status.icon} alt={status.label} className={`icon ${status.color}`} />
            </div>
            <div className="count">{status.count}</div>
            <div className="label">{status.label}</div>
          </StatusCard>
        ))}
      </OrderStatusGrid>

      <MetricsGrid>
        {metrics.map((metric, index) => (
          <MetricCard key={index} className={metric.className}>
            <div className="icon">
              <img src={metric.icon} alt={metric.label} />
            </div>
            <div className="content">
              <div className="value">{metric.value}</div>
              <div className="label">{metric.label}</div>
            </div>
          </MetricCard>
        ))}
      </MetricsGrid>


      <ContentSection>
        <Card>
          <CardHeader>
            <h2>Average Revenue</h2>
          </CardHeader>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <h2>Top Categories</h2>
            <select>
              <option>Filter By</option>
            </select>
          </CardHeader>
          <Table>
            <thead>
              <tr>
                <th>Categories Name</th>
                <th>Orders</th>
                <th>Earning</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category, index) => (
                <tr key={index}>
                  <td className="with-image">
                    {category.icon && <img src={category.icon} alt={category.name} />}
                    {category.name}
                  </td>
                  <td>{category.orders}</td>
                  <td>${category.earning}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      </ContentSection>

      <Card style={{ marginBottom: '24px' }}>
        <CardHeader>
          <h2>Recent Orders</h2>
        </CardHeader>
        <Table>
          <thead>
            <tr>
              <th>Number</th>
              <th>Date</th>
              <th>Name</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order, index) => (
              <tr key={index}>
                <td>{order.number}</td>
                <td>{order.date}</td>
                <td>{order.name}</td>
                <td>${order.amount}</td>
                <td>
                  <StatusBadge className={order.status.toLowerCase()}>
                    {order.status}
                  </StatusBadge>
                </td>
                <td>
                  <button>
                    <Search size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <Card>
          <CardHeader>
            <h2>Product Stock Report</h2>
            <select>
              <option>Select Category</option>
            </select>
          </CardHeader>
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Quantity</th>
                <th>Stock</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {stockItems.map((item, index) => (
                <tr key={index}>
                  <td className="with-image">
                    <img src={item.image} alt={item.name} />
                    {item.name}
                  </td>
                  <td>{item.quantity}</td>
                  <td>
                    <StatusBadge className={item.status === 'In Stock' ? 'in-stock' : 'out-of-stock'}>
                      {item.status}
                    </StatusBadge>
                  </td>
                  <td>
                    <button>
                      <Search size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Card>
            <CardHeader>
              <h2>Latest Reviews</h2>
              <button>View All</button>
            </CardHeader>
            {reviews.map((review, index) => (
              <ReviewCard key={index}>
                <img src={review.image} alt={review.product} />
                <div className="review-content">
                  <h3>{review.product}</h3>
                  <div className="user">{review.user}</div>
                  <div className="stars">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i}>
                        {i < review.rating ? '★' : '☆'}
                      </span>
                    ))}
                  </div>
                </div>
              </ReviewCard>
            ))}
          </Card>

          <Card>
            <CardHeader>
              <h2>Top Selling Product</h2>
              <select>
                <option>Select</option>
              </select>
            </CardHeader>
            {topProducts.map((product, index) => (
              <ProductCard key={index}>
                <div className="product-header">
                  <img src={product.image} alt={product.name} />
                  <div className="product-info">
                    <div className="date">{product.date}</div>
                    <div className="name">{product.name}</div>
                  </div>
                </div>
                <div className="product-stats">
                  <div className="stat">
                    <div className="label">Price</div>
                    <div className="value">${product.price}</div>
                  </div>
                  <div className="stat">
                    <div className="label">Orders</div>
                    <div className="value">{product.orders}</div>
                  </div>
                  <div className="stat">
                    <div className="label">Stock</div>
                    <div className="value">{product.stock}</div>
                  </div>
                  <div className="stat">
                    <div className="label">Amount</div>
                    <div className="value">${product.amount}</div>
                  </div>
                </div>
              </ProductCard>
            ))}
          </Card>
        </div>
      </div>
     </div>
      <Footer>
        Copyright 2024 © JSK
      </Footer>
    </DashboardContainer>
  );
};

export default Dashboard;
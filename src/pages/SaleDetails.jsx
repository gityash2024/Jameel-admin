import React from 'react';
import styled from 'styled-components';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';
import { TrendingUp, Users, ShoppingBag, Package, UserPlus } from 'lucide-react';

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 24px;
  padding: 24px;
`;

const Card = styled.div`
  background: ${props => props.bg || 'white'};
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
`;

const SummaryCards = styled.div`
  grid-column: span 8;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
`;

const StatsCard = styled.div`
  background: ${props => props.bg};
  padding: 20px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  .icon {
    background: rgba(255, 255, 255, 0.2);
    width: 40px;
    height: 40px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 8px;
  }

  .value {
    font-size: 24px;
    font-weight: 600;
    color: #111827;
  }

  .label {
    font-size: 14px;
    color: #6B7280;
  }

  .change {
    font-size: 12px;
    color: ${props => props.trend === 'up' ? '#10B981' : '#6B7280'};
  }
`;

const VisitorCard = styled(Card)`
  grid-column: span 4;
`;

const RevenueCard = styled(Card)`
  grid-column: span 8;
`;

const ProductsCard = styled(Card)`
  grid-column: span 4;

  .product-list {
    margin-top: 20px;
  }

  .product-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 0;
    border-bottom: 1px solid #E5E7EB;

    .info {
      display: flex;
      gap: 12px;
      align-items: center;

      .number {
        color: #6B7280;
        font-size: 14px;
      }

      .name {
        font-weight: 500;
      }
    }

    .bar-container {
      flex: 1;
      margin: 0 16px;
      background: #F3F4F6;
      height: 8px;
      border-radius: 4px;
      overflow: hidden;

      .bar {
        height: 100%;
        background: ${props => props.color};
        border-radius: 4px;
      }
    }

    .percentage {
      font-size: 14px;
      font-weight: 500;
      color: #111827;
      padding: 2px 8px;
      border-radius: 12px;
      background: ${props => props.bgColor || '#E5E7EB'};
    }
  }
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin-bottom: ${props => props.mb || '16px'};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ExportButton = styled.button`
  padding: 6px 12px;
  border: 1px solid #E5E7EB;
  border-radius: 6px;
  background: white;
  color: #6B7280;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    background: #F9FAFB;
  }
`;

// Mock data
const visitorData = [
  { month: 'Jan', loyal: 250, new: 200, unique: 300 },
  { month: 'Feb', loyal: 300, new: 250, unique: 350 },
  { month: 'Mar', loyal: 280, new: 220, unique: 330 },
  { month: 'Apr', loyal: 250, new: 180, unique: 280 },
  { month: 'May', loyal: 200, new: 150, unique: 250 },
  { month: 'Jun', loyal: 220, new: 180, unique: 270 },
  { month: 'Jul', loyal: 300, new: 350, unique: 320 },
  { month: 'Aug', loyal: 280, new: 300, unique: 340 },
  { month: 'Sep', loyal: 260, new: 280, unique: 300 },
  { month: 'Oct', loyal: 240, new: 250, unique: 280 },
  { month: 'Nov', loyal: 200, new: 220, unique: 240 },
  { month: 'Dec', loyal: 180, new: 200, unique: 220 },
];

const revenueData = [
  { day: 'Monday', online: 12000, offline: 13000 },
  { day: 'Tuesday', online: 15000, offline: 11000 },
  { day: 'Wednesday', online: 5000, offline: 22000 },
  { day: 'Thursday', online: 15000, offline: 5000 },
  { day: 'Friday', online: 12000, offline: 11000 },
  { day: 'Saturday', online: 15000, offline: 13000 },
  { day: 'Sunday', online: 20000, offline: 10000 },
];

const topProducts = [
  { id: '01', name: 'Home Decor Range', popularity: 45, color: '#2196f3' },
  { id: '02', name: 'Disney Princess Pink Bag 18"', popularity: 29, color: '#4CAF50' },
  { id: '03', name: 'Bathroom Essentials', popularity: 18, color: '#9C27B0' },
  { id: '04', name: 'Apple Smartwatches', popularity: 25, color: '#FF9800' },
];

const SaleDetails = () => {
  return (
    <Container>
      <SummaryCards>
        <StatsCard bg="#FFE4E4">
          <div className="icon">
            <TrendingUp color="white" size={20} />
          </div>
          <div className="value">$1k</div>
          <div className="label">Total Sales</div>
          <div className="change">+5% from yesterday</div>
        </StatsCard>

        <StatsCard bg="#FFF4E5">
          <div className="icon">
            <ShoppingBag color="white" size={20} />
          </div>
          <div className="value">300</div>
          <div className="label">Total Order</div>
          <div className="change">+5% from yesterday</div>
        </StatsCard>

        <StatsCard bg="#E4FFE4">
          <div className="icon">
            <Package color="white" size={20} />
          </div>
          <div className="value">5</div>
          <div className="label">Product Sold</div>
          <div className="change">+1.2% from yesterday</div>
        </StatsCard>

        <StatsCard bg="#F4E4FF">
          <div className="icon">
            <UserPlus color="white" size={20} />
          </div>
          <div className="value">8</div>
          <div className="label">New Customers</div>
          <div className="change">0.5% from yesterday</div>
        </StatsCard>
      </SummaryCards>

      <VisitorCard>
        <Title>Visitor Insights</Title>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={visitorData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="loyal" 
              stroke="#9C27B0" 
              strokeWidth={2}
              dot={false}
              name="Loyal Customers"
            />
            <Line 
              type="monotone" 
              dataKey="new" 
              stroke="#f44336" 
              strokeWidth={2}
              dot={false}
              name="New Customers"
            />
            <Line 
              type="monotone" 
              dataKey="unique" 
              stroke="#4CAF50" 
              strokeWidth={2}
              dot={false}
              name="Unique Customers"
            />
          </LineChart>
        </ResponsiveContainer>
      </VisitorCard>

      <RevenueCard>
        <Title mb="24px">Total Revenue</Title>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="day" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip />
            <Bar dataKey="online" fill="#2196f3" name="Online Sales" radius={[4, 4, 0, 0]} />
            <Bar dataKey="offline" fill="#4CAF50" name="Offline Sales" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </RevenueCard>

      <ProductsCard>
        <Title>
          Top Products
        </Title>
        <div className="product-list">
          {topProducts.map(product => (
            <div key={product.id} className="product-item">
              <div className="info">
                <span className="number">{product.id}</span>
                <span className="name">{product.name}</span>
              </div>
              <div className="bar-container">
                <div 
                  className="bar" 
                  style={{ 
                    width: `${product.popularity}%`,
                    background: product.color
                  }} 
                />
              </div>
              <span 
                className="percentage"
                style={{
                  background: `${product.color}20`,
                  color: product.color
                }}
              >
                {product.popularity}%
              </span>
            </div>
          ))}
        </div>
      </ProductsCard>
    </Container>
  );
};

export default SaleDetails;
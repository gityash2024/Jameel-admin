import React from 'react';
import styled from 'styled-components';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp } from 'lucide-react';

const Container = styled.div`
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
`;

const Header = styled.div`
  margin-bottom: 24px;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 8px;
`;

const TotalSales = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Amount = styled.span`
  font-size: 28px;
  font-weight: 600;
  color: #111827;
`;

const Growth = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #10B981;
  font-size: 14px;
  font-weight: 500;
`;

// const Legend = styled.div`
//   display: flex;
//   gap: 16px;
//   margin-top: 16px;
// `;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #6B7280;

  &:before {
    content: '';
    width: 12px;
    height: 12px;
    border-radius: 2px;
    background: ${props => props.color};
  }
`;

// Mock data
const data = [
  { day: 'Monday', onlineSales: 13000, offlineSales: 12000 },
  { day: 'Tuesday', onlineSales: 16000, offlineSales: 11000 },
  { day: 'Wednesday', onlineSales: 6000, offlineSales: 22000 },
  { day: 'Thursday', onlineSales: 15000, offlineSales: 6000 },
  { day: 'Friday', onlineSales: 12000, offlineSales: 11000 },
  { day: 'Saturday', onlineSales: 16000, offlineSales: 13000 },
  { day: 'Sunday', onlineSales: 20000, offlineSales: 11000 },
];

const SaleOver = () => {
  return (
    <Container>
      <Header>
        <Title>Sales Overview</Title>
        <TotalSales>
          <Amount>$2,503.83</Amount>
          <Growth>
            <TrendingUp size={16} />
            5.3%
          </Growth>
        </TotalSales>
        <Legend>
          <LegendItem color="#2196f3">Sales</LegendItem>
          <LegendItem color="#111827">Gross Margion</LegendItem>
          <LegendItem color="#6B7280">Net Profit</LegendItem>
        </Legend>
      </Header>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
          barGap={8}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            vertical={false}
            stroke="#E5E7EB"
          />
          <XAxis 
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6B7280', fontSize: 12 }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6B7280', fontSize: 12 }}
            ticks={[0, 5000, 10000, 15000, 20000, 25000]}
            domain={[0, 25000]}
            tickFormatter={(value) => `${value / 1000}k`}
          />
          <Tooltip
            contentStyle={{
              background: '#fff',
              border: '1px solid #E5E7EB',
              borderRadius: '6px',
              padding: '8px 12px',
            }}
            formatter={(value) => [`$${value.toLocaleString()}`, 'Sales']}
          />
          <Bar 
            dataKey="onlineSales" 
            fill="#2196f3" 
            radius={[4, 4, 0, 0]}
            name="Online Sales"
          />
          <Bar 
            dataKey="offlineSales" 
            fill="#4CAF50" 
            radius={[4, 4, 0, 0]}
            name="Offline Sales"
          />
        </BarChart>
      </ResponsiveContainer>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '24px', 
        marginTop: '16px' 
      }}>
        <LegendItem color="#2196f3">Online Sales</LegendItem>
        <LegendItem color="#4CAF50">Offline Sales</LegendItem>
      </div>
    </Container>
  );
};

export default SaleOver;
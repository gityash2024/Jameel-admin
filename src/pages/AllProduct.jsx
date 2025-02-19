import React, { useState } from 'react';
import styled from 'styled-components';
import { Edit, Trash2, Eye, Download, Upload, Plus } from 'lucide-react';
import ring from '../assets/ring.svg';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  padding: 24px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #1a237e;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  ${props => props.variant === 'primary' ? `
    background: #1a237e;
    color: white;
    border: none;
    
    &:hover {
      background: #151b4f;
    }
  ` : `
    background: white;
    color: #1a237e;
    border: 1px solid #1a237e;
    
    &:hover {
      background: #f5f7fb;
    }
  `}
`;

const FilterSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 16px;
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  min-width: 200px;
  
  &:focus {
    outline: none;
    border-color: #1a237e;
  }
`;

const SearchInput = styled.input`
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  min-width: 200px;
  
  &:focus {
    outline: none;
    border-color: #1a237e;
  }
`;

const ItemsPerPage = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #64748b;
  font-size: 14px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 12px;
  background: #f8fafc;
  color: #1a237e;
  font-weight: 500;
  font-size: 14px;
  border-bottom: 1px solid #e2e8f0;
  
  &:first-child {
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
  }
  
  &:last-child {
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
  }
`;

const Td = styled.td`
  padding: 12px;
  font-size: 14px;
  color: #334155;
  border-bottom: 1px solid #e2e8f0;
`;

const ProductImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 4px;
  object-fit: cover;
`;

const StockBadge = styled.span`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background: #dcfce7;
  color: #16a34a;
`;

const ActionGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ActionButton = styled.button`
  padding: 6px;
  border: none;
  background: none;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    color: #1a237e;
  }
`;

const Toggle = styled.label`
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
  
  &:checked + span {
    background-color: #1a237e;
  }
  
  &:checked + span:before {
    transform: translateX(20px);
  }
`;

const ToggleSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #e2e8f0;
  transition: 0.4s;
  border-radius: 34px;
  
  &:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
  }
`;

const mockProducts = [
  {
    id: 1,
    image: ring,
    name: "Gym Coords Set",
    sku: "SP18",
    price: 15.00,
    stock: "In Stock",
    approved: true,
    status: true
  },
  {
    id: 2,
    image: ring,
    name: "Mini Dress",
    sku: "FASH01",
    price: 14.70,
    stock: "In Stock",
    approved: true,
    status: true
  },
  // Add more mock products as needed
];

const AllProduct = () => {
  const [products, setProducts] = useState(mockProducts);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate=useNavigate()
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    brand: ''
  });

  const handleApproveToggle = (productId) => {
    setProducts(prev => prev.map(product => 
      product.id === productId 
        ? { ...product, approved: !product.approved }
        : product
    ));
  };

  const handleStatusToggle = (productId) => {
    setProducts(prev => prev.map(product => 
      product.id === productId 
        ? { ...product, status: !product.status }
        : product
    ));
  };

  const handleEdit = (productId) => {
    // Handle edit action
    console.log('Edit product:', productId);
  };

  const handleDelete = (productId) => {
    // Handle delete action
    console.log('Delete product:', productId);
  };

  const handleView = (productId) => {
    // Handle view action
    console.log('View product:', productId);
  };

  const handleImport = () => {
    // Handle import action
    console.log('Import products');
  };

  const handleExport = () => {
    // Handle export action
    console.log('Export products');
  };

  return (
    <Container>
      <Header>
        <Title>Products</Title>
        <ButtonGroup>
          <Button onClick={handleImport}>
            <Upload size={16} />
            Import
          </Button>
          <Button onClick={handleExport}>
            <Download size={16} />
            Export
          </Button>
          <Button onClick={() => navigate('/products/add')} variant="primary">
            <Plus size={16} />
            Add Product
          </Button>
        </ButtonGroup>
      </Header>

      <FilterSection>
        <FilterGroup>
          <ItemsPerPage>
            Show:
            <Select 
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
            >
              <option value={15}>15</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </Select>
            Items Per Page
          </ItemsPerPage>
        </FilterGroup>

        <FilterGroup>
          <Select 
            value={filters.type}
            onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
          >
            <option value="">Select Product Type</option>
            <option value="physical">Physical</option>
            <option value="digital">Digital</option>
          </Select>

          <Select
            value={filters.category}
            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
          >
            <option value="">Select Categories</option>
            <option value="clothing">Clothing</option>
            <option value="accessories">Accessories</option>
          </Select>

          <Select
            value={filters.brand}
            onChange={(e) => setFilters(prev => ({ ...prev, brand: e.target.value }))}
          >
            <option value="">Select Brands</option>
            <option value="brand1">Brand 1</option>
            <option value="brand2">Brand 2</option>
          </Select>

          <SearchInput
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </FilterGroup>
      </FilterSection>

      <Table>
        <thead>
          <tr>
            <Th style={{ width: '40px' }}>
              <input type="checkbox" />
            </Th>
            <Th>Image</Th>
            <Th>Name</Th>
            <Th>SKU</Th>
            <Th>Price</Th>
            <Th>Stock</Th>
            <Th>Approve</Th>
            <Th>Status</Th>
            <Th>Action</Th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <Td>
                <input type="checkbox" />
              </Td>
              <Td>
                <ProductImage src={product.image} alt={product.name} />
              </Td>
              <Td>{product.name}</Td>
              <Td>{product.sku}</Td>
              <Td>${product.price.toFixed(2)}</Td>
              <Td>
                <StockBadge>{product.stock}</StockBadge>
              </Td>
              <Td>
                <Toggle>
                  <ToggleInput
                    type="checkbox"
                    checked={product.approved}
                    onChange={() => handleApproveToggle(product.id)}
                  />
                  <ToggleSlider />
                </Toggle>
              </Td>
              <Td>
                <Toggle>
                  <ToggleInput
                    type="checkbox"
                    checked={product.status}
                    onChange={() => handleStatusToggle(product.id)}
                  />
                  <ToggleSlider />
                </Toggle>
              </Td>
              <Td>
                <ActionGroup>
                  <ActionButton onClick={() => handleEdit(product.id)}>
                    <Edit size={16} />
                  </ActionButton>
                  <ActionButton onClick={() => handleDelete(product.id)}>
                    <Trash2 size={16} />
                  </ActionButton>
                  <ActionButton onClick={() => handleView(product.id)}>
                    <Eye size={16} />
                  </ActionButton>
                </ActionGroup>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default AllProduct;
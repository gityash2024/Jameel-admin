import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Search } from 'lucide-react';
import ring from '../assets/ring.svg';

const Container = styled.div`
  padding: 24px;
  background: white;
  border-radius: 8px;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 24px;
`;

const SearchWrapper = styled.div`
  position: relative;
  margin-bottom: 24px;

  input {
    width: 100%;
    padding: 10px 40px 10px 16px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    outline: none;
    font-size: 14px;

    &:focus {
      border-color: #2196f3;
    }
  }

  svg {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
  }
`;

const ActionBar = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
`;

const BlackButton = styled.button`
  background: #000;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  border: none;

  &:hover {
    opacity: 0.9;
  }
`;

const ClearButton = styled.button`
  color: #2196f3;
  text-decoration: underline;
  background: none;
  border: none;
  cursor: pointer;
`;

const TableContainer = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: #f9fafb;

  th {
    background: #f3f4f6;
    padding: 16px;
    text-align: left;
    font-weight: 500;
    color: #374151;
  }

  td {
    padding: 16px;
    border-top: 1px solid #e5e7eb;
  }
`;

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  width: 16px;
  height: 16px;
  cursor: pointer;
`;

const ProductImage = styled.img`
  width: 48px;
  height: 48px;
  object-fit: contain;
`;

const StatusText = styled.span`
  color: #6b7280;
`;

// Mock data
const initialProducts = [
  {
    id: 1,
    image: ring,
    name: "Memories, Moments,",
    price: 49.99,
    comparePrice: 49.99,
    costPrice: "49.99 - 49.99",
    sku: "123456",
    inventory: 5,
    type: "A"
  },
  {
    id: 2,
    image: ring,
    name: "Memories, Moments,",
    price: 49.99,
    comparePrice: 49.99,
    costPrice: "N/A",
    sku: "123456",
    inventory: 0,
    type: "B"
  },
  {
    id: 3,
    image: ring,
    name: "Memories, Moments,",
    price: 49.99,
    comparePrice: 49.99,
    costPrice: "N/A",
    sku: "123456",
    inventory: 0,
    type: "B"
  }
];

const SaleProductlist = () => {
  const [products, setProducts] = useState(initialProducts);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectAll, setSelectAll] = useState(false);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (productId) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(prev => prev.filter(id => id !== productId));
    } else {
      setSelectedProducts(prev => [...prev, productId]);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(product => product.id));
    }
    setSelectAll(!selectAll);
  };

  const handleClearSelection = () => {
    setSelectedProducts([]);
    setSelectAll(false);
  };

  const handleUpdatePrices = () => {
    console.log('Updating prices for:', selectedProducts);
  };

  useEffect(() => {
    setSelectAll(selectedProducts.length === filteredProducts.length);
  }, [selectedProducts, filteredProducts]);

  return (
    <Container>
      <Title>Products List</Title>
      
      <SearchWrapper>
        <input
          type="text"
          placeholder="Search with brand and catel"
          value={searchQuery}
          onChange={handleSearch}
        />
        <Search size={20} />
      </SearchWrapper>

      <ActionBar>
        <BlackButton onClick={handleSelectAll}>
          <Checkbox
            checked={selectAll}
            onChange={handleSelectAll}
          />
          All Selected
        </BlackButton>

        <BlackButton onClick={handleUpdatePrices}>
          Update Prices
        </BlackButton>

        {selectedProducts.length > 0 && (
          <>
            <StatusText>
              All items are selected
            </StatusText>
            <ClearButton onClick={handleClearSelection}>
              Clear selection
            </ClearButton>
          </>
        )}
      </ActionBar>

      <TableContainer>
        <Table>
          <thead>
            <tr>
              <th></th>
              <th>Products</th>
              <th>Products Name</th>
              <th>Price</th>
              <th>Compare Price</th>
              <th>Cost Price</th>
              <th>SKU</th>
              <th>Inventory</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td>
                  <Checkbox
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => handleSelect(product.id)}
                  />
                </td>
                <td>
                  <ProductImage src={product.image} alt={product.name} />
                </td>
                <td>{product.name}</td>
                <td>${product.price}</td>
                <td>${product.comparePrice}</td>
                <td>{product.costPrice}</td>
                <td>{product.sku}</td>
                <td>{product.inventory}</td>
                <td>{product.type}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default SaleProductlist;
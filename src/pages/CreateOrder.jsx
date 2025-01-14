import React, { useState } from 'react';
import styled from 'styled-components';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import babyessentails from '../assets/babyessentails.svg';
import bagemporium from '../assets/bagemporium.svg';
import books from '../assets/books.svg';
import christmas from '../assets/christmas.svg';
import classicfurnishin from '../assets/classicfurnishin.svg';
import cart from '../assets/cart.svg';
import ring from '../assets/ring.svg';

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
  padding: 2rem;
`;

const MainSection = styled.div`
  background: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
`;

const CartSection = styled.div`
  background: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  h2 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1a202c;
  }
`;

const CategorySlider = styled.div`
  position: relative;
  margin-bottom: 2rem;
`;

const SliderControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  position: absolute;
  right: 0;
  top: -2.5rem;
`;

const SliderButton = styled.button`
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  background: white;
  color: #4a5568;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #f7fafc;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;
`;

const CategoryCard = styled.div`
  background: #f8fafc;
  border-radius: 0.5rem;
  padding: 1rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f1f5f9;
  }

  img {
    width: 48px;
    height: 48px;
    margin: 0 auto 0.5rem;
  }

  p {
    font-size: 0.875rem;
    color: #4a5568;
  }
`;

const Controls = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  outline: none;
  font-size: 0.875rem;

  &:focus {
    border-color: #4299e1;
  }
`;

const SelectInput = styled.select`
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  outline: none;
  font-size: 0.875rem;
  background: white;
  min-width: 150px;

  &:focus {
    border-color: #4299e1;
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const ProductCard = styled.div`
  background: #f8fafc;
  border-radius: 0.5rem;
  padding: 1rem;

  img {
    width: 100%;
    height: auto;
    margin-bottom: 1rem;
    border-radius: 0.375rem;
  }

  h3 {
    font-size: 0.875rem;
    font-weight: 500;
    color: #1a202c;
    margin-bottom: 0.5rem;
  }

  .details {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .item-count {
    font-size: 0.75rem;
    color: #4a5568;
  }

  .price {
    font-weight: 600;
    color: #1a202c;
  }

  button {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.375rem;
    background: white;
    color: #4a5568;
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    cursor: pointer;

    &:hover {
      background: #f7fafc;
    }
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;

  button {
    min-width: 2rem;
    height: 2rem;
    padding: 0 0.5rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.375rem;
    background: white;
    color: #4a5568;
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover:not(.active, :disabled) {
      background: #f7fafc;
    }

    &.active {
      background: #E67E22;
      color: white;
      border-color: #E67E22;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  .dots {
    color: #4a5568;
  }
`;

const EmptyCart = styled.div`
  text-align: center;
  padding: 2rem;

  img {
    width: 200px;
    height: auto;
    margin: 0 auto 1rem;
  }

  p {
    color: #4a5568;
    font-size: 0.875rem;
  }
`;

const CreateOrders = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categoryPage, setCategoryPage] = useState(1);

  const categories = [
    { id: 1, name: 'Baby Essentials', icon: babyessentails },
    { id: 2, name: 'Bag Emporium', icon: bagemporium },
    { id: 3, name: 'Books', icon: books },
    { id: 4, name: 'Christmas', icon: christmas },
    { id: 5, name: 'Classic Furnishing', icon: classicfurnishin }
  ];

  const products = Array(20).fill(null).map((_, index) => ({
    id: index + 1,
    name: 'Gym Coords Set',
    image: ring,
    price: 15.00,
    itemCount: 1
  }));

  const itemsPerPage = 8;
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisibleButtons = 5;

    if (totalPages <= maxVisibleButtons) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={currentPage === i ? 'active' : ''}
          >
            {i}
          </button>
        );
      }
    } else {
      buttons.push(
        <button
          key="prev"
          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft size={16} />
        </button>
      );

      if (currentPage > 3) {
        buttons.push(
          <button key={1} onClick={() => handlePageChange(1)}>1</button>,
          <span key="dots1" className="dots">...</span>
        );
      }

      for (let i = Math.max(1, currentPage - 1); i <= Math.min(totalPages, currentPage + 1); i++) {
        buttons.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={currentPage === i ? 'active' : ''}
          >
            {i}
          </button>
        );
      }

      if (currentPage < totalPages - 2) {
        buttons.push(
          <span key="dots2" className="dots">...</span>,
          <button key={totalPages} onClick={() => handlePageChange(totalPages)}>{totalPages}</button>
        );
      }

      buttons.push(
        <button
          key="next"
          onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          <ChevronRight size={16} />
        </button>
      );
    }

    return buttons;
  };

  const visibleProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Container>
      <MainSection>
        <SectionHeader>
          <h2>Categories</h2>
        </SectionHeader>

        <CategorySlider>
          <SliderControls>
            <SliderButton 
              onClick={() => setCategoryPage(p => Math.max(1, p - 1))}
              disabled={categoryPage === 1}
            >
              <ChevronLeft size={16} />
            </SliderButton>
            <SliderButton 
              onClick={() => setCategoryPage(p => p + 1)}
              disabled={categoryPage * 5 >= categories.length}
            >
              <ChevronRight size={16} />
            </SliderButton>
          </SliderControls>

          <CategoryGrid>
            {categories.map(category => (
              <CategoryCard key={category.id}>
                <img src={category.icon} alt={category.name} />
                <p>{category.name}</p>
              </CategoryCard>
            ))}
          </CategoryGrid>
        </CategorySlider>

        <Controls>
          <SearchInput
            type="text"
            placeholder="Search Here"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <SelectInput 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Select</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </SelectInput>
        </Controls>

        <ProductGrid>
          {visibleProducts.map(product => (
            <ProductCard key={product.id}>
              <img src={product.image} alt={product.name} />
              <h3>{product.name}</h3>
              <div className="details">
                <span className="item-count">{product.itemCount} Item</span>
                <span className="price">${product.price.toFixed(2)}</span>
              </div>
              <button>
                <Plus size={16} />
                Add
              </button>
            </ProductCard>
          ))}
        </ProductGrid>

        <Pagination>
          {renderPaginationButtons()}
        </Pagination>
      </MainSection>

      <CartSection>
        <SectionHeader>
          <h2>Cart</h2>
        </SectionHeader>
        <EmptyCart>
          <img src={cart} alt="Empty Cart" />
          <p>No items in a cart</p>
        </EmptyCart>
      </CartSection>
    </Container>
  );
};

export default CreateOrders;
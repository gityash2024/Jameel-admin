import React, { useState } from 'react';
import styled from 'styled-components';
import { Trash2, Star, FileX } from 'lucide-react';
import ring from '../assets/ring.png';

const Container = styled.div`
  padding: 2rem;
`;

const Header = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 2rem;
`;

const Controls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ShowEntries = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #4a5568;
  font-size: 0.875rem;

  select {
    padding: 0.25rem 0.5rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.375rem;
    outline: none;
  }
`;

const SearchInput = styled.input`
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  outline: none;
  width: 240px;

  &:focus {
    border-color: #4299e1;
    box-shadow: 0 0 0 1px #4299e1;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: white;
  border-radius: 0.5rem;
  overflow: hidden;
`;

const Th = styled.th`
  text-align: left;
  padding: 1rem;
  background: #f8fafc;
  color: #4a5568;
  font-weight: 500;
  font-size: 0.875rem;
  border-bottom: 1px solid #e2e8f0;
  white-space: nowrap;

  &:first-child {
    padding-left: 1.5rem;
  }

  &:last-child {
    padding-right: 1.5rem;
  }
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  color: #1a202c;
  font-size: 0.875rem;
  vertical-align: middle;

  &:first-child {
    padding-left: 1.5rem;
  }

  &:last-child {
    padding-right: 1.5rem;
  }
`;

const ProductImage = styled.img`
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 0.25rem;
`;

const StarRating = styled.div`
  display: flex;
  gap: 0.25rem;
  color: #ECC94B;
`;

const DeleteButton = styled.button`
  color: #E53E3E;
  opacity: 0.8;
  transition: opacity 0.2s;
  padding: 0.25rem;

  &:hover {
    opacity: 1;
  }
`;

const NoDataContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 0.5rem;
  text-align: center;
`;

const NoDataIcon = styled.div`
  margin-bottom: 1.5rem;
  color: #A0AEC0;
`;

const NoDataText = styled.p`
  color: #4A5568;
  font-size: 1rem;
  margin-bottom: 0.5rem;
`;

const NoDataSubText = styled.p`
  color: #718096;
  font-size: 0.875rem;
`;

const Review = () => {
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [searchQuery, setSearchQuery] = useState('');
  const [reviews, setReviews] = useState([]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      setReviews(reviews.filter(review => review.id !== id));
    }
  };

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, index) => (
      <Star
        key={index}
        size={16}
        fill={index < rating ? '#ECC94B' : 'none'}
        color={index < rating ? '#ECC94B' : '#CBD5E0'}
      />
    ));
  };

  const filteredReviews = reviews.filter(review =>
    review.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    review.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container>
      <Header>Reviews</Header>

      <Controls>
        <ShowEntries>
          Show:
          <select 
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
          >
            <option value={15}>15</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          items Per Page
        </ShowEntries>

        <SearchInput
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Controls>

      {filteredReviews.length > 0 ? (
        <Table>
          <thead>
            <tr>
              <Th style={{ width: '40px' }}>
                <input type="checkbox" />
              </Th>
              <Th>Image</Th>
              <Th>Customer Name</Th>
              <Th>Product Name</Th>
              <Th>Rating</Th>
              <Th>Create At</Th>
              <Th>Action</Th>
            </tr>
          </thead>
          <tbody>
            {filteredReviews.map(review => (
              <tr key={review.id}>
                <Td>
                  <input type="checkbox" />
                </Td>
                <Td>
                  <ProductImage src={review.image} alt={review.productName} />
                </Td>
                <Td>{review.customerName}</Td>
                <Td>{review.productName}</Td>
                <Td>
                  <StarRating>
                    {renderStars(review.rating)}
                  </StarRating>
                </Td>
                <Td>{review.createdAt}</Td>
                <Td>
                  <DeleteButton onClick={() => handleDelete(review.id)}>
                    <Trash2 size={16} />
                  </DeleteButton>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <NoDataContainer>
          <NoDataIcon>
            <FileX size={60} />
          </NoDataIcon>
          <NoDataText>No Reviews Found</NoDataText>
          <NoDataSubText>There are no customer reviews to display at this time.</NoDataSubText>
        </NoDataContainer>
      )}
    </Container>
  );
};

export default Review;
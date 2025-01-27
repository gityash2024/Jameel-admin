import React from 'react';
import styled from 'styled-components';
import { MapPin, Phone, Clock, ChevronRight, Star } from 'lucide-react';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const StoreCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const StoreName = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 16px;
`;

const RatingSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;

  .stars {
    display: flex;
    gap: 2px;
  }

  .rating {
    font-weight: 500;
    color: #111827;
  }

  .reviews {
    color: #6B7280;
  }
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: #6B7280;
  font-size: 15px;
  margin-bottom: 16px;

  svg {
    color: #6B7280;
    flex-shrink: 0;
  }
`;

const ViewDetailsButton = styled.button`
  width: 100%;
  padding: 12px;
  margin-top: 8px;
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  color: #2563EB;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;

  &:hover {
    background: #F9FAFB;
  }
`;

const StarIcon = styled(Star)`
  color: ${props => props.filled ? '#F59E0B' : '#E5E7EB'};
  fill: ${props => props.filled ? '#F59E0B' : 'none'};
`;

const ViewDetails = () => {
  const stores = [
    {
      id: 1,
      name: "JSK Jewelry Downtown",
      rating: 4.8,
      reviews: 128,
      address: "123 Main Street, New York, NY 10001",
      phone: "(212) 555-0123",
      hours: "10:00 AM - 7:00 PM"
    },
    {
      id: 2,
      name: "JSK Jewelry Brooklyn",
      rating: 4.6,
      reviews: 96,
      address: "456 Park Avenue, Brooklyn, NY 11201",
      phone: "(718) 555-0124",
      hours: "11:00 AM - 8:00 PM"
    },
    {
      id: 3,
      name: "JSK Jewelry Queens",
      rating: 4.7,
      reviews: 112,
      address: "789 Queens Blvd, Queens, NY 11375",
      phone: "(718) 555-0125",
      hours: "10:00 AM - 6:00 PM"
    }
  ];

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <StarIcon
        key={index}
        size={20}
        filled={index < Math.floor(rating)}
      />
    ));
  };

  return (
    <Container>
      {stores.map(store => (
        <StoreCard key={store.id}>
          <StoreName>{store.name}</StoreName>
          
          <RatingSection>
            <div className="stars">
              {renderStars(store.rating)}
            </div>
            <span className="rating">{store.rating}</span>
            <span className="reviews">({store.reviews} reviews)</span>
          </RatingSection>

          <InfoItem>
            <MapPin size={20} />
            {store.address}
          </InfoItem>

          <InfoItem>
            <Phone size={20} />
            {store.phone}
          </InfoItem>

          <InfoItem>
            <Clock size={20} />
            {store.hours}
          </InfoItem>

          <ViewDetailsButton>
            View Details
            <ChevronRight size={18} />
          </ViewDetailsButton>
        </StoreCard>
      ))}
    </Container>
  );
};

export default ViewDetails;
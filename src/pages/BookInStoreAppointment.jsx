import React, { useState } from 'react';
import styled from 'styled-components';
import { Calendar, Clock, User, Mail, Phone, MessageSquare } from 'lucide-react';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 32px 24px;
`;

const Header = styled.div`
  margin-bottom: 32px;
  text-align: center;

  h1 {
    font-size: 28px;
    color: #111827;
    margin-bottom: 8px;
    font-weight: 600;
  }

  p {
    color: #6B7280;
    font-size: 16px;
  }
`;

const Form = styled.form`
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const Section = styled.div`
  margin-bottom: 32px;

  h2 {
    font-size: 18px;
    color: #111827;
    margin-bottom: 16px;
    font-weight: 600;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;

  label {
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
    color: #374151;
    font-weight: 500;
  }

  input, select, textarea {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #E5E7EB;
    border-radius: 8px;
    font-size: 14px;
    color: #111827;
    transition: all 0.2s;

    &:focus {
      outline: none;
      border-color: #2563EB;
      box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
    }

    &::placeholder {
      color: #9CA3AF;
    }
  }

  textarea {
    height: 100px;
    resize: vertical;
  }
`;

const TimeSlots = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;

  @media (max-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const TimeSlot = styled.button`
  padding: 12px;
  border: 1px solid ${props => props.selected ? '#2563EB' : '#E5E7EB'};
  border-radius: 8px;
  background: ${props => props.selected ? '#EFF6FF' : 'white'};
  color: ${props => props.selected ? '#2563EB' : '#374151'};
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #F9FAFB;
  }

  &:disabled {
    background: #F3F4F6;
    color: #9CA3AF;
    cursor: not-allowed;
  }
`;

const ServiceType = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const ServiceCard = styled.div`
  border: 2px solid ${props => props.selected ? '#2563EB' : '#E5E7EB'};
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s;
  background: ${props => props.selected ? '#EFF6FF' : 'white'};

  h3 {
    font-size: 16px;
    font-weight: 600;
    color: #111827;
    margin-bottom: 8px;
  }

  p {
    font-size: 14px;
    color: #6B7280;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 12px;
  background: #2563EB;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #1D4ED8;
  }

  &:disabled {
    background: #9CA3AF;
    cursor: not-allowed;
  }
`;

const BookInStoreAppointment = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    date: '',
    timeSlot: '',
    serviceType: '',
    notes: ''
  });

  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [selectedService, setSelectedService] = useState(null);

  const timeSlots = [
    '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM',
    '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ];

  const services = [
    {
      id: 1,
      title: 'Jewelry Consultation',
      description: 'One-on-one consultation with our jewelry expert'
    },
    {
      id: 2,
      title: 'Ring Sizing',
      description: 'Professional ring sizing and adjustment service'
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  return (
    <Container>
      <Header>
        <h1>Book In Store Appointment</h1>
        <p>Schedule a consultation with our jewelry experts</p>
      </Header>

      <Form onSubmit={handleSubmit}>
        <Section>
          <h2>Personal Information</h2>
          <Grid>
            <FormGroup>
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                placeholder="Enter your first name"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                placeholder="Enter your last name"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
          </Grid>
          <Grid>
            <FormGroup>
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
          </Grid>
        </Section>

        <Section>
          <h2>Choose Date & Time</h2>
          <FormGroup>
            <label>Select Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <label>Select Time Slot</label>
            <TimeSlots>
              {timeSlots.map((time, index) => (
                <TimeSlot
                  key={index}
                  selected={selectedTimeSlot === time}
                  onClick={() => {
                    setSelectedTimeSlot(time);
                    setFormData(prev => ({ ...prev, timeSlot: time }));
                  }}
                  type="button"
                >
                  {time}
                </TimeSlot>
              ))}
            </TimeSlots>
          </FormGroup>
        </Section>

        <Section>
          <h2>Select Service</h2>
          <ServiceType>
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                selected={selectedService === service.id}
                onClick={() => {
                  setSelectedService(service.id);
                  setFormData(prev => ({ ...prev, serviceType: service.title }));
                }}
              >
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </ServiceCard>
            ))}
          </ServiceType>
        </Section>

        <Section>
          <h2>Additional Notes</h2>
          <FormGroup>
            <textarea
              name="notes"
              placeholder="Any specific requirements or questions?"
              value={formData.notes}
              onChange={handleInputChange}
            />
          </FormGroup>
        </Section>

        <SubmitButton type="submit">
          Book Appointment
        </SubmitButton>
      </Form>
    </Container>
  );
};

export default BookInStoreAppointment;
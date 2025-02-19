import React, { useState } from 'react';
import styled from 'styled-components';
import { Search, Bell, ChevronDown, LogOut, User, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeaderContainer = styled.header`
  padding: 0.75rem 1rem;
  background: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e5e7eb;
`;

const SearchContainer = styled.div`
  position: relative;
  width: 300px;

  input {
    width: 100%;
    padding: 0.5rem 1rem 0.5rem 2.5rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.375rem;
    outline: none;
    font-size: 0.875rem;
    color: #4b5563;

    &::placeholder {
      color: #9ca3af;
    }

    &:focus {
      border-color: #2196f3;
      box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.1);
    }
  }

  svg {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
    color: #9ca3af;
  }
`;

const SearchSuggestions = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  margin-top: 0.25rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  max-height: 200px;
  overflow-y: auto;
  z-index: 50;
`;

const SuggestionItem = styled.div`
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 0.875rem;
  color: #4b5563;

  &:hover {
    background: #f3f4f6;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;
`;

const NotificationBadge = styled.div`
  position: relative;
  
  span {
    position: absolute;
    top: -8px;
    right: -8px;
    background: #ef4444;
    color: white;
    font-size: 0.75rem;
    padding: 0.125rem 0.375rem;
    border-radius: 9999px;
    min-width: 18px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const NotificationModal = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  right: -10px;
  width: 320px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
`;

const NotificationHeader = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 {
    font-size: 16px;
    font-weight: 600;
    color: #111827;
    margin: 0;
  }
`;

const NotificationList = styled.div`
  max-height: 400px;
  overflow-y: auto;
`;

const NotificationItem = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f9fafb;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const NotificationTitle = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #111827;
  margin-bottom: 4px;
`;

const NotificationTime = styled.div`
  font-size: 12px;
  color: #6b7280;
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  color: #4b5563;
  transition: all 0.2s;
  background: none;
  border: none;
  cursor: pointer;

  &:hover {
    color: #374151;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const AdminSection = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;

  .admin-text {
    display: flex;
    flex-direction: column;
    
    .title {
      font-size: 0.875rem;
      font-weight: 500;
      color: #111827;
    }
    
    .subtitle {
      font-size: 0.75rem;
      color: #6b7280;
    }
  }
`;

const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  min-width: 200px;
  z-index: 50;

  .dropdown-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    color: #4b5563;
    transition: all 0.2s;
    cursor: pointer;
    
    &:hover {
      background: #f3f4f6;
      color: #111827;
    }

    svg {
      width: 18px;
      height: 18px;
    }
  }
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  background: #f3f4f6;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
`;

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    'Dashboard', 'Users', 'Products', 'Orders', 'Media', 'Blog', 'Taxies',
    'Shipping', 'Coupons', 'Currencies', 'Review', "FAQ's", 'Book-In-Appointment',
    'Find-Near-Store', 'Settings'
  ];

  const mockNotifications = [
    {
      id: 1,
      title: 'New order received #1234',
      time: '5 minutes ago'
    },
    {
      id: 2,
      title: 'Payment confirmed for order #5678',
      time: '1 hour ago'
    },
    {
      id: 3,
      title: 'New user registration',
      time: '2 hours ago'
    },
    {
      id: 4,
      title: 'Stock alert: Product XYZ running low',
      time: '3 hours ago'
    },
    {
      id: 5,
      title: 'System update completed',
      time: '5 hours ago'
    }
  ];

  const filteredItems = menuItems.filter(item =>
    item.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setShowSuggestions(query.length > 0);
  };

  const handleSuggestionClick = (item) => {
    setSearchQuery('');
    setShowSuggestions(false);
    const path = '/' + item.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-');
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleNotificationClick = (notification) => {
    setShowNotifications(false);
    console.log('Notification clicked:', notification);
  };

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.admin-section') && 
          !event.target.closest('.search-container') && 
          !event.target.closest('.notification-section')) {
        setIsAdminMenuOpen(false);
        setShowSuggestions(false);
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <HeaderContainer>
      <SearchContainer className="search-container">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <Search size={16} />
        {showSuggestions && filteredItems.length > 0 && (
          <SearchSuggestions>
            {filteredItems.map((item, index) => (
              <SuggestionItem
                key={index}
                onClick={() => handleSuggestionClick(item)}
              >
                {item}
              </SuggestionItem>
            ))}
          </SearchSuggestions>
        )}
      </SearchContainer>

      <RightSection>
        <NotificationBadge className="notification-section">
          <IconButton 
            title="Notifications"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={20} />
          </IconButton>
          <span>5</span>
          {showNotifications && (
            <NotificationModal>
              <NotificationHeader>
                <h3>Notifications</h3>
                <IconButton onClick={() => setShowNotifications(false)}>
                  <X size={16} />
                </IconButton>
              </NotificationHeader>
              <NotificationList>
                {mockNotifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <NotificationTitle>{notification.title}</NotificationTitle>
                    <NotificationTime>{notification.time}</NotificationTime>
                  </NotificationItem>
                ))}
              </NotificationList>
            </NotificationModal>
          )}
        </NotificationBadge>

        <AdminSection 
          className="admin-section"
          onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)}
        >
          <UserAvatar>
            <User size={18} />
          </UserAvatar>
          <div className="admin-text">
            <span className="title">Admin</span>
            <span className="subtitle">Admin</span>
          </div>
          <ChevronDown size={16} />
          {isAdminMenuOpen && (
            <Dropdown>
              <div className="dropdown-item" onClick={handleLogout}>
                <LogOut size={18} />
                Logout
              </div>
            </Dropdown>
          )}
        </AdminSection>
      </RightSection>
    </HeaderContainer>
  );
};

export default Header;
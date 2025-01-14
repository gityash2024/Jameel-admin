import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  Search, 
  Globe, 
  Bell, 
  Moon, 
  ChevronDown, 
  Maximize2, 
  Languages,
  User,
  Settings,
  LogOut,
  UserCircle,
  LayoutDashboard 
} from 'lucide-react';

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

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;
`;

const QuickLinks = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: #4b5563;
  
  span {
    font-size: 0.875rem;
  }

  svg {
    width: 16px;
    height: 16px;
    transition: transform 0.2s;
    ${props => props.isOpen && 'transform: rotate(180deg);'}
  }
`;

const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
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
    
    &:hover {
      background: #f3f4f6;
      color: #111827;
    }

    svg {
      width: 18px;
      height: 18px;
    }
  }

  .divider {
    height: 1px;
    background: #e5e7eb;
    margin: 0.5rem 0;
  }
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  color: #4b5563;
  transition: all 0.2s;

  &:hover {
    color: #374151;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const PosButton = styled.button`
  background: #111827;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    background: #1f2937;
  }
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

const UserAvatar = styled.div`
  width: 24px;
  height: 24px;
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
  const [isQuickLinksOpen, setIsQuickLinksOpen] = useState(false);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);

  // Quick Links Data
  const quickLinksData = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: LayoutDashboard, 
      onClick: () => console.log('Dashboard clicked') 
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: Settings, 
      onClick: () => console.log('Settings clicked') 
    },
    { 
      id: 'profile', 
      label: 'Profile', 
      icon: UserCircle, 
      onClick: () => console.log('Profile clicked') 
    }
  ];

  // Admin Menu Data
  const adminMenuData = [
    { 
      id: 'profile', 
      label: 'View Profile', 
      icon: UserCircle, 
      onClick: () => console.log('Profile clicked') 
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: Settings, 
      onClick: () => console.log('Settings clicked') 
    },
    { 
      id: 'logout', 
      label: 'Logout', 
      icon: LogOut, 
      onClick: () => console.log('Logout clicked') 
    }
  ];

  // Navigation Items
  const navItems = [
    { 
      icon: Globe, 
      onClick: () => console.log('Globe clicked'),
      label: 'Global',
      id: 'globe'
    },
    { 
      icon: Maximize2, 
      onClick: () => console.log('Maximize clicked'),
      label: 'Maximize',
      id: 'maximize'
    },
    { 
      icon: Languages, 
      onClick: () => console.log('Language clicked'),
      label: 'Language',
      id: 'language'
    },
    { 
      icon: Bell, 
      onClick: () => console.log('Notifications clicked'),
      label: 'Notifications',
      id: 'notifications',
      badge: 5
    },
    { 
      icon: Moon, 
      onClick: () => console.log('Theme clicked'),
      label: 'Theme',
      id: 'theme'
    }
  ];

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    console.log('Search query:', query);
  };

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.quick-links') && !event.target.closest('.admin-section')) {
        setIsQuickLinksOpen(false);
        setIsAdminMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <HeaderContainer>
      <SearchContainer>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <Search size={16} />
      </SearchContainer>

      <RightSection>
        <QuickLinks 
          className="quick-links"
          isOpen={isQuickLinksOpen}
          onClick={() => setIsQuickLinksOpen(!isQuickLinksOpen)}
        >
          <span>Quick Links</span>
          <ChevronDown size={16} />
          {isQuickLinksOpen && (
            <Dropdown>
              {quickLinksData.map((link, index) => (
                <React.Fragment key={link.id}>
                  <div className="dropdown-item" onClick={link.onClick}>
                    <link.icon size={18} />
                    {link.label}
                  </div>
                  {index < quickLinksData.length - 1 && <div className="divider" />}
                </React.Fragment>
              ))}
            </Dropdown>
          )}
        </QuickLinks>

        <PosButton onClick={() => console.log('POS clicked')}>
          POS
        </PosButton>

        {navItems.map((item) => (
          item.id === 'notifications' ? (
            <NotificationBadge key={item.id}>
              <IconButton onClick={item.onClick} title={item.label}>
                <item.icon size={20} />
              </IconButton>
              {item.badge > 0 && <span>{item.badge}</span>}
            </NotificationBadge>
          ) : (
            <IconButton 
              key={item.id}
              onClick={item.onClick}
              title={item.label}
            >
              <item.icon size={20} />
            </IconButton>
          )
        ))}

        <IconButton>
          <UserAvatar>A</UserAvatar>
        </IconButton>

        <AdminSection 
          className="admin-section"
          onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)}
        >
          <div className="admin-text">
            <span className="title">Admin</span>
            <span className="subtitle">Admin</span>
          </div>
          <ChevronDown size={16} />
          {isAdminMenuOpen && (
            <Dropdown>
              {adminMenuData.map((item, index) => (
                <React.Fragment key={item.id}>
                  <div className="dropdown-item" onClick={item.onClick}>
                    <item.icon size={18} />
                    {item.label}
                  </div>
                  {index < adminMenuData.length - 1 && <div className="divider" />}
                </React.Fragment>
              ))}
            </Dropdown>
          )}
        </AdminSection>
      </RightSection>
    </HeaderContainer>
  );
};

export default Header;
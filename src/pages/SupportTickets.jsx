import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { MessageSquare, ChevronDown, MessageCircle, Clock, Trash2, Eye, X, Send, Filter } from 'lucide-react';
import { supportAPI } from '../services/api';
import { toast } from 'react-hot-toast';
import { format, formatDistanceToNow } from 'date-fns';

const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

const Container = styled.div`
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a202c;
`;

const FilterContainer = styled.div`
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const FilterDropdown = styled.select`
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  background-color: white;
  font-size: 0.875rem;
  color: #4a5568;
  min-width: 150px;
`;

const SearchInput = styled.input`
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  min-width: 250px;

  &:focus {
    outline: none;
    border-color: #4299e1;
  }
`;

const Table = styled.table`
  width: 100%;
  background: white;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
  border-collapse: collapse;
`;

const Th = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: 500;
  font-size: 0.875rem;
  color: #4a5568;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
`;

const Td = styled.td`
  padding: 1rem;
  font-size: 0.875rem;
  color: #1a202c;
  border-bottom: 1px solid #e2e8f0;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: ${props => {
    switch (props.status) {
      case 'new': return '#EBF8FF';
      case 'open': return '#E6FFFA';
      case 'inProgress': return '#FFFAF0';
      case 'resolved': return '#F0FFF4';
      case 'closed': return '#EDF2F7';
      default: return '#EDF2F7';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'new': return '#3182CE';
      case 'open': return '#319795';
      case 'inProgress': return '#DD6B20';
      case 'resolved': return '#38A169';
      case 'closed': return '#718096';
      default: return '#718096';
    }
  }};
`;

const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  color: #4a5568;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f7fafc;
  }

  ${props => props.danger && `
    color: #E53E3E;
    &:hover {
      background: #FFF5F5;
    }
  `}

  ${props => props.primary && `
    background: #4299E1;
    color: white;
    border-color: #4299E1;
    &:hover {
      background: #3182CE;
    }
  `}
`;

const ActionGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 0.5rem;
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
`;

const ModalHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
`;

const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a202c;
`;

const CloseButton = styled.button`
  border: none;
  background: none;
  cursor: pointer;
  color: #718096;
  
  &:hover {
    color: #4a5568;
  }
`;

const TicketDetails = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
`;

const TicketInfo = styled.div`
  margin-bottom: 1rem;
  
  h3 {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #2d3748;
  }
  
  p {
    margin-bottom: 0.5rem;
    color: #4a5568;
    font-size: 0.875rem;
  }
  
  .label {
    font-weight: 500;
    color: #718096;
    display: inline-block;
    width: 100px;
  }
`;

const TicketStatusControl = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
  
  label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #4a5568;
  }
  
  select {
    padding: 0.5rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.375rem;
    background-color: white;
    font-size: 0.875rem;
  }
`;

const MessageList = styled.div`
  padding: 1.5rem;
`;

const Message = styled.div`
  margin-bottom: 1.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const MessageHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  
  .avatar {
    width: 2rem;
    height: 2rem;
    background-color: ${props => props.isAdmin ? '#4299E1' : '#F687B3'};
    border-radius: 9999px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 600;
    font-size: 0.75rem;
  }
  
  .info {
    h4 {
      font-size: 0.875rem;
      font-weight: 600;
      color: #2d3748;
    }
    
    span {
      font-size: 0.75rem;
      color: #718096;
    }
  }
`;

const MessageContent = styled.div`
  background-color: ${props => props.isAdmin ? '#EBF8FF' : '#FAFAFA'};
  padding: 1rem;
  border-radius: 0.5rem;
  margin-left: 2.5rem;
  color: #4a5568;
  font-size: 0.875rem;
  white-space: pre-line;
`;

const ReplyForm = styled.div`
  padding: 1.5rem;
  border-top: 1px solid #e2e8f0;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: #4299e1;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  ${props => props.primary && `
    background-color: #4299E1;
    color: white;
    border-color: #4299E1;
    
    &:hover {
      background-color: #3182CE;
    }
    
    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  `}
  
  ${props => !props.primary && `
    background-color: white;
    color: #4a5568;
    
    &:hover {
      background-color: #f7fafc;
    }
  `}
`;

const ConfirmationModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
`;

const ConfirmationContent = styled.div`
  background: white;
  border-radius: 0.5rem;
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
`;

const ConfirmationTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 1rem;
`;

const ConfirmationMessage = styled.p`
  color: #4a5568;
  margin-bottom: 1.5rem;
`;

const SkeletonRow = styled.tr`
  td {
    position: relative;
    overflow: hidden;
    
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, #f0f0f0 25%, #f7f7f7 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: ${shimmer} 1.5s infinite;
    }
  }
`;

const SkeletonCell = styled.div`
  height: 20px;
  width: ${props => props.width || '100%'};
  background: #f0f0f0;
  border-radius: 4px;
  margin: 0.5rem 0;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
  text-align: center;
`;

const EmptyStateIcon = styled.div`
  color: #a0aec0;
  margin-bottom: 1rem;
`;

const EmptyStateText = styled.p`
  color: #4a5568;
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const PaginationButton = styled.button`
  padding: 0.5rem 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  background: ${props => props.active ? '#4299E1' : 'white'};
  color: ${props => props.active ? 'white' : '#4a5568'};
  font-size: 0.75rem;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.5 : 1};
  
  &:hover {
    background: ${props => props.active ? '#3182CE' : '#f7fafc'};
  }
`;

const getStatusLabel = (status) => {
  switch (status) {
    case 'new': return 'New';
    case 'open': return 'Open';
    case 'inProgress': return 'In Progress';
    case 'resolved': return 'Resolved';
    case 'closed': return 'Closed';
    default: return status;
  }
};

const truncateText = (text, maxLength = 80) => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

const SupportTicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [replying, setReplying] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusLoading, setStatusLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const perPage = 10;

  useEffect(() => {
    fetchTickets();
  }, [filterStatus, currentPage]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const params = { page: currentPage, limit: perPage };
      
      if (filterStatus !== 'all') {
        params.status = filterStatus;
      }
      
      if (searchQuery) {
        params.search = searchQuery;
      }
      
      const response = await supportAPI.getAllTickets(params);
      setTickets(response.data.data.supportTickets);
      setTotalPages(Math.ceil(response.data.data.count / perPage));
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast.error('Failed to load support tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchTickets();
  };

  const handleViewTicket = async (ticketId) => {
    try {
      const response = await supportAPI.getTicket(ticketId);
      setSelectedTicket(response.data.data.supportTicket);
      setNewStatus(response.data.data.supportTicket.status);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching ticket details:', error);
      toast.error('Failed to load ticket details');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTicket(null);
    setReplyMessage('');
    setNewStatus('');
  };

  const handleStatusChange = async () => {
    if (!selectedTicket || newStatus === selectedTicket.status) return;
    
    try {
      setStatusLoading(true);
      await supportAPI.updateTicketStatus(selectedTicket._id, newStatus);
      
      setSelectedTicket(prev => ({
        ...prev,
        status: newStatus,
        isResolved: newStatus === 'resolved'
      }));
      
      toast.success('Ticket status updated');
      
      fetchTickets();
    } catch (error) {
      console.error('Error updating ticket status:', error);
      toast.error('Failed to update ticket status');
    } finally {
      setStatusLoading(false);
    }
  };

  const handleSubmitReply = async (e) => {
    e.preventDefault();
    
    if (!replyMessage.trim() || !selectedTicket) return;
    
    try {
      setReplying(true);
      
      const response = await supportAPI.addTicketResponse(selectedTicket._id, {
        message: replyMessage,
        status: newStatus !== selectedTicket.status ? newStatus : undefined
      });
      
      setSelectedTicket(response.data.data.supportTicket);
      setReplyMessage('');
      
      toast.success('Response sent successfully');
      
      if (newStatus !== selectedTicket.status) {
        fetchTickets();
      }
    } catch (error) {
      console.error('Error sending reply:', error);
      toast.error('Failed to send response');
    } finally {
      setReplying(false);
    }
  };

  const handleDeleteConfirmation = (ticket) => {
    setConfirmAction({
      type: 'delete',
      id: ticket._id,
      message: 'Are you sure you want to delete this support ticket? This action cannot be undone.'
    });
    setIsConfirmModalOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!confirmAction) return;
    
    try {
      if (confirmAction.type === 'delete') {
        await supportAPI.deleteTicket(confirmAction.id);
        toast.success('Ticket deleted successfully');
        fetchTickets();
        
        if (selectedTicket && selectedTicket._id === confirmAction.id) {
          handleCloseModal();
        }
      }
    } catch (error) {
      console.error('Error performing action:', error);
      toast.error('Action failed');
    } finally {
      setIsConfirmModalOpen(false);
      setConfirmAction(null);
    }
  };

  const renderTicketDate = (date) => {
    if (!date) return '';
    
    const ticketDate = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (ticketDate.toDateString() === today.toDateString()) {
      return `Today at ${format(ticketDate, 'h:mm a')}`;
    } else if (ticketDate.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${format(ticketDate, 'h:mm a')}`;
    } else {
      return format(ticketDate, 'MMM d, yyyy - h:mm a');
    }
  };

  const getInitials = (name) => {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const renderSkeletonLoader = () => (
    <Table>
      <thead>
        <tr>
          <Th>ID</Th>
          <Th>Subject</Th>
          <Th>User</Th>
          <Th>Status</Th>
          <Th>Last Updated</Th>
          <Th>Actions</Th>
        </tr>
      </thead>
      <tbody>
        {[1, 2, 3, 4, 5].map((index) => (
          <SkeletonRow key={index}>
            <Td><SkeletonCell width="40px" /></Td>
            <Td><SkeletonCell width="200px" /></Td>
            <Td><SkeletonCell width="120px" /></Td>
            <Td><SkeletonCell width="80px" /></Td>
            <Td><SkeletonCell width="150px" /></Td>
            <Td><SkeletonCell width="120px" /></Td>
          </SkeletonRow>
        ))}
      </tbody>
    </Table>
  );

  const renderEmptyState = () => (
    <EmptyState>
      <EmptyStateIcon>
        <MessageCircle size={48} />
      </EmptyStateIcon>
      <EmptyStateText>No support tickets found</EmptyStateText>
    </EmptyState>
  );

  return (
    <Container>
      <Header>
        <Title>Support Tickets</Title>
      </Header>

      <FilterContainer>
        <FilterDropdown
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="all">All Statuses</option>
          <option value="new">New</option>
          <option value="open">Open</option>
          <option value="inProgress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </FilterDropdown>
        
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem' }}>
          <SearchInput
            type="text"
            placeholder="Search by subject or user email"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <ActionButton type="submit" primary>
            <Filter size={16} />
            Filter
          </ActionButton>
        </form>
      </FilterContainer>

      {loading ? (
        renderSkeletonLoader()
      ) : tickets.length === 0 ? (
        renderEmptyState()
      ) : (
        <>
          <Table>
            <thead>
              <tr>
                <Th>ID</Th>
                <Th>Subject</Th>
                <Th>User</Th>
                <Th>Status</Th>
                <Th>Last Updated</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket._id}>
                  <Td>#{ticket._id.slice(-6)}</Td>
                  <Td>{truncateText(ticket.subject)}</Td>
                  <Td>
                    {ticket.user ? (
                      <span>
                        {ticket.user.firstName} {ticket.user.lastName}
                        <br />
                        <small style={{ color: '#718096' }}>{ticket.user.email}</small>
                      </span>
                    ) : (
                      <span style={{ color: '#A0AEC0' }}>Unknown User</span>
                    )}
                  </Td>
                  <Td>
                    <StatusBadge status={ticket.status}>
                      {getStatusLabel(ticket.status)}
                    </StatusBadge>
                  </Td>
                  <Td>
                    {ticket.lastResponseAt 
                      ? formatDistanceToNow(new Date(ticket.lastResponseAt), { addSuffix: true })
                      : formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
                  </Td>
                  <Td>
                    <ActionGroup>
                      <ActionButton onClick={() => handleViewTicket(ticket._id)}>
                        <Eye size={16} />
                        View
                      </ActionButton>
                      <ActionButton danger onClick={() => handleDeleteConfirmation(ticket)}>
                        <Trash2 size={16} />
                        Delete
                      </ActionButton>
                    </ActionGroup>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
          
          {totalPages > 1 && (
            <Pagination>
              <PaginationButton
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </PaginationButton>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => (
                  page === 1 || 
                  page === totalPages || 
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ))
                .map((page, index, array) => {
                  if (index > 0 && array[index - 1] !== page - 1) {
                    return (
                      <React.Fragment key={`ellipsis-${page}`}>
                        <span>...</span>
                        <PaginationButton
                          active={currentPage === page}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </PaginationButton>
                      </React.Fragment>
                    );
                  }
                  return (
                    <PaginationButton
                      key={page}
                      active={currentPage === page}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </PaginationButton>
                  );
                })}
              
              <PaginationButton
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </PaginationButton>
            </Pagination>
          )}
        </>
      )}

      {isModalOpen && selectedTicket && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Support Ticket #{selectedTicket._id.slice(-6)}</ModalTitle>
              <CloseButton onClick={handleCloseModal}>
                <X size={20} />
              </CloseButton>
            </ModalHeader>
            
            <TicketDetails>
              <TicketInfo>
                <h3>{selectedTicket.subject}</h3>
                <p>
                  <span className="label">Created:</span> 
                  {renderTicketDate(selectedTicket.createdAt)}
                </p>
                <p>
                  <span className="label">From:</span> 
                  {selectedTicket.user ? (
                    `${selectedTicket.user.firstName} ${selectedTicket.user.lastName} (${selectedTicket.user.email})`
                  ) : 'Unknown User'}
                </p>
                <p>
                  <span className="label">Status:</span> 
                  <StatusBadge status={selectedTicket.status}>
                    {getStatusLabel(selectedTicket.status)}
                  </StatusBadge>
                </p>
                
                <TicketStatusControl>
                  <label>Update Status:</label>
                  <select 
                    value={newStatus || selectedTicket.status} 
                    onChange={(e) => setNewStatus(e.target.value)}
                  >
                    <option value="new">New</option>
                    <option value="open">Open</option>
                    <option value="inProgress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                  
                  <Button 
                    primary 
                    onClick={handleStatusChange}
                    disabled={statusLoading || newStatus === selectedTicket.status}
                  >
                    {statusLoading ? 'Updating...' : 'Update Status'}
                  </Button>
                </TicketStatusControl>
              </TicketInfo>
            </TicketDetails>
            
            <MessageList>
              <Message>
                <MessageHeader>
                  <div className="avatar">
                    {selectedTicket.user ? getInitials(`${selectedTicket.user.firstName} ${selectedTicket.user.lastName}`) : 'U'}
                  </div>
                  <div className="info">
                    <h4>{selectedTicket.user ? `${selectedTicket.user.firstName} ${selectedTicket.user.lastName}` : 'Unknown User'}</h4>
                    <span>{renderTicketDate(selectedTicket.createdAt)}</span>
                  </div>
                </MessageHeader>
                <MessageContent>
                  {selectedTicket.message}
                </MessageContent>
              </Message>
              
              {selectedTicket.responses && selectedTicket.responses.map((response, index) => (
                <Message key={index}>
                  <MessageHeader isAdmin={response.isAdminResponse}>
                    <div className="avatar">
                      {response.isAdminResponse 
                        ? 'A'
                        : selectedTicket.user ? getInitials(`${selectedTicket.user.firstName} ${selectedTicket.user.lastName}`) : 'U'
                      }
                    </div>
                    <div className="info">
                      <h4>
                        {response.isAdminResponse 
                          ? 'Admin'
                          : selectedTicket.user ? `${selectedTicket.user.firstName} ${selectedTicket.user.lastName}` : 'Unknown User'
                        }
                      </h4>
                      <span>{renderTicketDate(response.createdAt)}</span>
                    </div>
                  </MessageHeader>
                  <MessageContent isAdmin={response.isAdminResponse}>
                    {response.message}
                  </MessageContent>
                </Message>
              ))}
            </MessageList>
            
            {!selectedTicket.isResolved && (
              <ReplyForm>
                <form onSubmit={handleSubmitReply}>
                  <TextArea
                    placeholder="Type your reply here..."
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    disabled={replying}
                  />
                  
                  <ButtonGroup>
                    <Button type="button" onClick={handleCloseModal}>
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      primary
                      disabled={replying || !replyMessage.trim()}
                    >
                      {replying ? 'Sending...' : 'Send Reply'}
                      <Send size={16} style={{ marginLeft: '0.5rem' }} />
                    </Button>
                  </ButtonGroup>
                </form>
              </ReplyForm>
            )}
          </ModalContent>
        </Modal>
      )}
      
      {isConfirmModalOpen && confirmAction && (
        <ConfirmationModal>
          <ConfirmationContent>
            <ConfirmationTitle>Confirm Action</ConfirmationTitle>
            <ConfirmationMessage>{confirmAction.message}</ConfirmationMessage>
            
            <ButtonGroup>
              <Button onClick={() => {
                setIsConfirmModalOpen(false);
                setConfirmAction(null);
              }}>
                Cancel
              </Button>
              <Button primary onClick={handleConfirmAction}>
                Confirm
              </Button>
            </ButtonGroup>
          </ConfirmationContent>
        </ConfirmationModal>
      )}
    </Container>
  );
};

export default SupportTicketsPage;
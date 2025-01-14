import React, { useState } from 'react';
import styled from 'styled-components';
import { Plus, Pencil, Trash2, Eye } from 'lucide-react';
import ring from '../assets/ring.svg';

const Container = styled.div`
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  h1 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1a202c;
  }
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  background: white;
  font-size: 0.875rem;

  &:hover {
    background: #f7fafc;
  }
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

  &:first-child {
    padding-left: 1.5rem;
  }

  &:last-child {
    padding-right: 1.5rem;
  }
`;

const BlogImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 0.25rem;
  object-fit: cover;
`;

const ActionButton = styled.button`
  padding: 0.25rem;
  color: ${props => {
    if (props.delete) return '#EF4444';
    if (props.edit) return '#3B82F6';
    return '#10B981';
  }};
  opacity: 0.8;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 44px;
  height: 22px;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #CBD5E0;
    transition: .4s;
    border-radius: 34px;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 2px;
    bottom: 2px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
  }

  input:checked + .slider {
    background-color: #48BB78;
  }

  input:checked + .slider:before {
    transform: translateX(22px);
  }
`;

const Blogs = () => {
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [searchQuery, setSearchQuery] = useState('');
  const [blogs, setBlogs] = useState([
    {
      id: 1,
      image: ring,
      title: "The Art and Science of Web Design: Trends, Tips, and Techniques",
      createdAt: "20/6/2024 4:05 pm",
      status: true
    },
    {
      id: 2,
      image: ring,
      title: "The Art of Blogging: Mastering Your Voice and Audience Engagement",
      createdAt: "20/6/2024 4:01 pm",
      status: true
    },
    {
      id: 3,
      image: ring,
      title: "The Ultimate Guide to Black Friday: Tips, Deals, and Must-Have Items",
      createdAt: "20/6/2024 3:58 pm",
      status: true
    },
    {
      id: 4,
      image: ring,
      title: "How to Host a Magical Christmas Party: Tips and Ideas",
      createdAt: "19/6/2024 11:02 am",
      status: true
    },
    {
      id: 5,
      image: ring,
      title: "Christmas Eve Traditions: Creating Magical Memories",
      createdAt: "19/6/2024 11:00 am",
      status: true
    },
    {
      id: 6,
      image: ring,
      title: "10 Creative DIY Christmas Decorations to Spruce Up Your Home",
      createdAt: "19/6/2024 10:57 am",
      status: true
    },
    {
      id: 7,
      image: ring,
      title: "Affordable Designer Bags: Style Without Breaking the Bank",
      createdAt: "19/6/2024 9:35 am",
      status: true
    },
    {
      id: 8,
      image: ring,
      title: "Sustainable Bags: Eco-Friendly Options for the Conscious Shopper",
      createdAt: "19/6/2024 9:34 am",
      status: true
    },
    {
      id: 9,
      image: ring,
      title: "The Ultimate Guide to Choosing the Perfect Bag for Every Occasion",
      createdAt: "19/6/2024 9:32 am",
      status: true
    },
    {
      id: 10,
      image: ring,
      title: "How to Safely Use Marijuana Products: A Comprehensive Guide",
      createdAt: "15/6/2024 3:56 pm",
      status: true
    },
    {
      id: 11,
      image: ring,
      title: "Innovative Marijuana Products on the Market Right Now",
      createdAt: "15/6/2024 3:50 pm",
      status: true
    },
    {
      id: 12,
      image: ring,
      title: "Choosing the Best Marijuana Product for Medical Use",
      createdAt: "15/6/2024 3:46 pm",
      status: true
    },
    {
      id: 13,
      image: ring,
      title: "The Science of Sparkle: Understanding Gemstone Cuts and Clarity",
      createdAt: "15/6/2024 3:43 pm",
      status: true
    }
  ]);

  const handleToggleStatus = (id) => {
    setBlogs(blogs.map(blog => 
      blog.id === id ? { ...blog, status: !blog.status } : blog
    ));
  };

  const handleEdit = (id) => {
    console.log('Edit blog:', id);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      setBlogs(blogs.filter(blog => blog.id !== id));
    }
  };

  const handleView = (id) => {
    console.log('View blog:', id);
  };

  const handleAddBlog = () => {
    console.log('Add new blog');
  };

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container>
      <Header>
        <h1>Blogs</h1>
        <AddButton onClick={handleAddBlog}>
          <Plus size={16} />
          Add Blog
        </AddButton>
      </Header>

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

      <Table>
        <thead>
          <tr>
            <Th style={{ width: '40px' }}>
              <input type="checkbox" />
            </Th>
            <Th>Image</Th>
            <Th>Title</Th>
            <Th>Create At</Th>
            <Th>Status</Th>
            <Th>Action</Th>
          </tr>
        </thead>
        <tbody>
          {filteredBlogs.map(blog => (
            <tr key={blog.id}>
              <Td>
                <input type="checkbox" />
              </Td>
              <Td>
                <BlogImage src={blog.image} alt={blog.title} />
              </Td>
              <Td>{blog.title}</Td>
              <Td>{blog.createdAt}</Td>
              <Td>
                <ToggleSwitch>
                  <input
                    type="checkbox"
                    checked={blog.status}
                    onChange={() => handleToggleStatus(blog.id)}
                  />
                  <span className="slider" />
                </ToggleSwitch>
              </Td>
              <Td>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <ActionButton edit onClick={() => handleEdit(blog.id)}>
                    <Pencil size={16} />
                  </ActionButton>
                  <ActionButton delete onClick={() => handleDelete(blog.id)}>
                    <Trash2 size={16} />
                  </ActionButton>
                  <ActionButton onClick={() => handleView(blog.id)}>
                    <Eye size={16} />
                  </ActionButton>
                </div>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Blogs;
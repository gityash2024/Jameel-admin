import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main layout container */}
      <div className="flex">
        {/* Sidebar - fixed position */}
        <div className="fixed left-0 z-40">
          <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        </div>

        {/* Main content area */}
        <div className="flex-1 ml-[280px]"> {/* Width matches sidebar width */}
          {/* Header - fixed at top of content area */}
          <div className="fixed top-0 right-0 left-[280px] z-30 bg-white">
            <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
          </div>

          {/* Main content - scrollable area below header */}
          <main className="pt-16 min-h-screen"> {/* Add padding-top to account for fixed header */}
            <div className="p-6">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
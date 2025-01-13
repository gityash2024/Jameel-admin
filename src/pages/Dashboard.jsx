const Dashboard = () => {
    return (
      <div>
        <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-gray-500">Total Orders</h2>
            <p className="text-3xl font-bold">256</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-gray-500">Total Revenue</h2>
            <p className="text-3xl font-bold">$12,345</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-gray-500">Total Products</h2>
            <p className="text-3xl font-bold">189</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-gray-500">Total Customers</h2>
            <p className="text-3xl font-bold">1,234</p>
          </div>
        </div>
      </div>
    );
  };
  
  export default Dashboard;
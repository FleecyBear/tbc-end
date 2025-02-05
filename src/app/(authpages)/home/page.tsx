import React from 'react';


const Home: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      

      <main className="flex-grow p-8">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold text-center mb-6">Welcome to MarketPlace</h1>
          
          {/* Search Bar */}
          <div className="mb-8 flex justify-center">
            <input
              type="text"
              className="p-3 w-1/2 rounded border border-gray-300"
              placeholder="Search for items..."
            />
          </div>

          {/* Featured Items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <img src="item.jpg" alt="Item" className="w-full h-48 object-cover rounded-t-lg" />
              <h3 className="text-xl font-semibold mt-4">Item Name</h3>
              <p className="text-gray-600">Description of the item.</p>
              <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded">Buy Now</button>
            </div>
            {/* Repeat for more items */}
          </div>
        </div>
      </main>

    </div>
  );
};

export default Home;

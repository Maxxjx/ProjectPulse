<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
  <h1 className="text-3xl font-bold">Tasks</h1>
  <div className="flex space-x-2">
    {session?.user?.role !== 'client' && (
      <button className="bg-[#8B5CF6] hover:bg-opacity-90 transition px-4 py-2 rounded text-white flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
        Add Task
      </button>
    )}
    <div className="relative">
      <button 
        className="bg-[#1F2937] border border-gray-600 hover:bg-opacity-90 transition px-4 py-2 rounded flex items-center"
        onClick={() => setIsFilterOpen(!isFilterOpen)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
        </svg>
        Filter
      </button>
    </div>
  </div>
</div> 
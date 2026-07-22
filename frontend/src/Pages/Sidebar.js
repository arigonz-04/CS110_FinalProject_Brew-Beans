import React from 'react';

function Sidebar({filters, setFilters}){
    const handleCategoryChange = (e) => {
        const {id, checked} = e.target;
        setFilters(prev => ({...prev, [id]: checked}));
    };

    const searchChange = (e) => {
        setFilters(prev => ({...prev, search: e.target.value}));
    };

    return(
        <div className="sidebar-content">
        <h1 className="company_name">Beans and Brew Market</h1>
        <input type="text" placeholder="Search" value={filters.search} onChange={searchChange}/>
        <nav className='menu'>
            <a>Your Account</a>
            <a>Create Listing</a>
        </nav>
        <div className='filters'>
            <h3>Categories</h3>
            <label>
          <input 
            type='checkbox' 
            id="coffee" 
            checked={filters.coffee} 
            onChange={handleCategoryChange} 
          /> Coffee
        </label><br/>

        <label>
          <input 
            type='checkbox' 
            id="machines" 
            checked={filters.machines} 
            onChange={handleCategoryChange} 
          /> Espresso Machines
        </label><br/>

        <label>
          <input 
            type='checkbox' 
            id="syrups" 
            checked={filters.syrups} 
            onChange={handleCategoryChange} 
          /> Syrups
        </label><br/>

        <label>
          <input 
            type='checkbox' 
            id="accessories" 
            checked={filters.accessories} 
            onChange={handleCategoryChange} 
          /> Accessories
        </label>
        </div>
        </div>

    );
}

export default Sidebar;
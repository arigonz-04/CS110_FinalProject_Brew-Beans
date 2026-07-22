import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Grid from './Grid';
import "../CSS/Home.css";

function Home({onSelectListing}) {
    const [filters, setFilters] = useState({
        search: '',
        minprice: '',
        maxprice: '',
        'Coffee Beans': false,
        'Espresso Machines': false,
        'Syrups': false,
        'Accessories': false
    });

return(
<div className="container" style={{display: 'flex', gap: '20px'}}>
    <div className="sidebar">
        <Sidebar filters={filters} setFilters={setFilters}/>
    </div>
    <div className="grid">
        <Grid filters={filters} onSelectListing={onSelectListing}/>
    </div>
</div>
);
}

export default Home;
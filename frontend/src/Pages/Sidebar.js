import React, { useState } from 'react';


function Sidebar(){

    return(
        <div>
        <h1 className="company_name">Beans and Brew Market</h1>
        <input type="text" placeholder="Search"></input>
        <nav className='menu'>
            <a>Your Account</a>
            <a>Create Listing</a>
        </nav>
        <div className='filters'>
            <label htmlFor='coffee'>Coffee</label>
            <input type='checkbox' id="coffee"></input>
             <label htmlFor='machines'>Expresso Machines</label>
            <input type='checkbox' id="machines"></input>
            <label htmlFor='syrups'>Syrups</label>
            <input type='checkbox' id="syrups"></input>
             <label htmlFor='accessories'>Accessories</label>
            <input type='checkbox' id="accessories"></input>
        </div>
        </div>

    );
}

export default Sidebar;
import React, { useState } from 'react';
import "../CSS/Home.css";
import "Grid.js"

function Home() {

return(
<div className="container">
    <div className="sidebar">
        <Sidebar/>
    </div>
    <div className="grid">
        <Grid/>
    </div>
</div>
);
}

export default Home;
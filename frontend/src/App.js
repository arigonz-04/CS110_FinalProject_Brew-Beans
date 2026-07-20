import React, { useState } from 'react';
import './Components/App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('Home');

  const renderPage = () => {
    switch(currentPage) {
      case 'Home':
        return <div className="page"><h2>Marketplace Home Grid (Barsha)</h2></div>;
      case 'Login':
        return <div className="page"><h2>Auth Portal (Ariana)</h2></div>;
      case 'Profile':
        return <div className="page"><h2>User Profile Dashboard (Ariana)</h2></div>;
      case 'ProductDetail':
        return <div className="page"><h2>Product Detail & Recommendations (Barsha)</h2></div>;
      case 'CreateListing':
        return <div className="page"><h2>List Your Coffee Gear (Ariana)</h2></div>;
      case 'Messages':
        return <div className="page"><h2>Coffee Chat Corner (Shared)</h2></div>;
      default:
        return <div className="page"><h2>Marketplace Home Grid</h2></div>;
    }
  };

  return (
    <div className="App">
      <nav className="navbar" style={{ padding: '15px', background: '#4a3b32', color: '#fff', display: 'flex', gap: '15px' }}>
        <b style={{marginRight: 'auto'}}>☕ Brew & Beans Market</b>
        <button onClick={() => setCurrentPage('Home')}>Home</button>
        <button onClick={() => setCurrentPage('Login')}>Login</button>
        <button onClick={() => setCurrentPage('CreateListing')}>+ Sell Gear</button>
        <button onClick={() => setCurrentPage('Profile')}>My Profile</button>
        <button onClick={() => setCurrentPage('Messages')}>Messages</button>
      </nav>
      
      <main style={{ padding: '20px' }}>
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
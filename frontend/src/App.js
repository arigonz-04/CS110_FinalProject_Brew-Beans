import React, { useState } from 'react';
import './CSS/App.css';
import CreateListing from "./Pages/CreateListing";
import Login from "./Pages/Login";
import CreateAccount from "./Pages/CreateAccount";
import UserProfile from "./Pages/Profile";
import Home from "./Pages/Home";
import ProductListing from './Pages/ProductListing';

function App() {
  const [currentPage, setCurrentPage] = useState("Login");
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedListingId, setSelectedListingId] = useState(null);
  const [selectedSellerId, setSelectedSellerId] = useState(null);

  const signOut = () => {
    setCurrentUser(null);
    setCurrentPage('Login');
  }

  const handleSelectListing = (id) => {
    setSelectedListingId(id);
    setCurrentPage('ProductDetail');
  }

  const handleSelectSeller = (sellerId) => {
    setSelectedSellerId(sellerId);
    setCurrentPage('SellerProfile');
  }
  
  const renderPage = () => {
    switch(currentPage) {
      case 'Home':
        return <Home onSelectListing={handleSelectListing} />;
      case 'Login':
        return <Login setCurrentPage={setCurrentPage} setCurrentUser={setCurrentUser}/>;
      case 'CreateAccount':
        return <CreateAccount setCurrentPage={setCurrentPage}/>;
      case 'Profile':
        return <UserProfile userId={currentUser?.id || 1} currentUser={currentUser} setCurrentPage={setCurrentPage}/>;
        case 'SellerProfile':
          return <UserProfile userId={selectedSellerId} currentUser={currentUser} setCurrentPage={setCurrentPage}/>;
      case 'ProductDetail':
        return ( 
        <ProductListing listingId={selectedListingId} currentUser={currentUser} onBack={()=> setCurrentPage('Home')} onSelectSeller={handleSelectSeller}/>);
      case 'CreateListing':
        return <CreateListing userId={currentUser?.id || 1}/>;
      case 'Messages':
        return <div className="page"><h2>Coffee Chat Corner (Shared)</h2></div>;
      default:
        return <div className="page"><h2>Marketplace Home Grid</h2></div>;
    }
  };

  return (
    <div className="App">
      {currentPage !== 'Login' && currentPage !== 'CreateAccount' && (
        <nav className="navbar" style={{ padding: '15px', background: '#4a3b32', color: '#fff', display: 'flex', gap: '15px' }}>
          <b style={{marginRight: 'auto'}}>Brew & Beans Market</b>
          <button onClick={() => setCurrentPage('Home')}>Home</button>
          <button onClick={() => setCurrentPage('CreateListing')}>Create Listing</button>
          <button onClick={() => setCurrentPage('Profile')}>My Profile</button>
          <button onClick={() => setCurrentPage('Messages')}>Messages</button>
          <button onClick={signOut}>Sign Out</button>
        </nav>
      )}
      
      <main style={{ padding: '20px' }}>
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
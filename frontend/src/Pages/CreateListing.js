import React, { useState } from 'react';
import "../CSS/CreateListing.css";

function CreateListing() {
  const [listing, setListing] = useState({
    title: "",
    price: "",
    category: "",
    item_condition: "",
    description: "",
    image_url: "",
  });

  // Updates input fields
  const handleChange = (e) => {
    setListing({...listing, [e.target.name]: e.target.value,
    });
  };

  // Stores image path
  const handleImage = (e) => {
    if (e.target.files.length > 0) {
      setListing({...listing, image_url: `/images/${e.target.files[0].name}`,
      });
    }
  };

  // Runs when Publish Listing is clicked
 const handleSubmit = (e) => {
    e.preventDefault();

    if (!listing.title.trim() || !listing.price || !listing.category || !listing.item_condition || !listing.image_url) {
      alert("Please fill out all required fields!");
      return;
    }

    //sends listing data to backend API
    fetch("http://localhost:3000/api/listings", {
        method: "POST",
        headers: {"Content-Type": "application/json" },
        body: JSON.stringify(listing)
    })
    .then(res => res.json())
    .then(data => {
        console.log("Response from backend:", data);
        alert("Listing submitted successfully!");
    })
    .catch(error => {
        console.error("Error:", error);
    });
};

  return (
    <div className="CreateListing-container">
      <h1 className="CreateListing-title">Create Listing</h1>

      <form onSubmit={handleSubmit}>
        <div className="CreateListing-top-section">
          <label className="CreateListing-pic_upload-box"> + Add Photo <input type="file" accept="image/*" hidden onChange={handleImage}/></label>

          <div className="listing-details-stack">
            <div className="input-group">
              <label>Title</label>
              <input
                className="input-field"
                type="text"
                name="title"
                value={listing.title}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>Price</label>
              <input
                className="input-field"
                type="number"
                name="price"
                min="0"
                step="0.01"
                value={listing.price}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>Category</label>
              <select
                className="input-field"
                name="category"
                value={listing.category}
                onChange={handleChange}>
                <option value=""></option>
                <option value="Coffee Beans">Coffee Beans</option>
                <option value="Espresso Machines">Espresso Machines</option>
                <option value="Syrups">Syrups</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>

            <div className="input-group" style={{ marginBottom: '24px' }}>
              <label>Condition</label>
              <select
                className="input-field"
                name="item_condition"
                value={listing.item_condition}
                onChange={handleChange}>
                <option value=""></option>
                <option value="New">New</option>
                <option value="Like New">Like New</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="description-section">
          <label>Description</label>
          <textarea
            className="description-textarea"
            name="description"
            value={listing.description}
            onChange={handleChange}
            placeholder="Describe your item..."
          />
        </div>

        <button className="submit-btn" type="submit"> Publish Listing </button>
      </form>
    </div>
  );
}

export default CreateListing;
import React, { useState, useEffect } from 'react';
import "../CSS/ProductListing.css";

function ProductListing({ listingId, currentUser, onBack, onSelectSeller}) {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!listingId) return;

        fetch(`http://localhost:3000/api/listings/${listingId}`)
            .then(res => res.json())
            .then(data => {
                setProduct(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching listing details:", err);
                setLoading(false);
            });
    }, [listingId]);

    const handleBuy = () => {
        if (!currentUser) { //user check
            alert("Please log in first to purchase this item!");
            return;
        }

        fetch(`http://localhost:3000/api/listings/${listingId}/buy`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ buyer_id: currentUser.id })
        })
        .then(res => res.json())
        .then(data => {
            alert(data.message);
            if (data.message.includes("successfully")) {
                setProduct(prev => ({ ...prev, status: 'sold' }));
            }
        })
        .catch(err => console.error("Error purchasing item:", err));
    };

    if (loading) return <p>Loading listing details...</p>;
    if (!product) return <p>Listing not found.</p>;

    const isOwner = currentUser && currentUser.id === product.seller_id;

    return (
        <div className="product-details-container">
            <button type="button" onClick={onBack} className="back-btn">
                ← Back to Marketplace
            </button>
            
            <div className="product-main">
                {product.image_url && (
                    <img src={product.image_url} alt={product.title} className="product-detail-img" />
                )}
                
                <div className="product-info">
                    <h1>{product.title}</h1>
                    <h2>${product.price}</h2>
                    <p><strong>Condition:</strong> {product.item_condition}</p>
                    <p><strong>Category:</strong> {product.category}</p>
                    <p><strong>Description:</strong> {product.description || "No description provided."}</p>
                    
                    <hr />
                    
                    <div className="seller-details">
                        <h3>Seller Details</h3>
                        <p><strong>Seller:</strong><span onClick={() => onSelectSeller && onSelectSeller(product.seller_id)}
                        style={{textDecoration: 'underline',cursor: 'pointer'}}>{product.seller_name}</span></p>
                        <p><strong>Contact:</strong> {product.seller_email}</p>
                    </div>

                    <hr />

                    {/* Conditional rendering for status and buy options */}
                    {product.status === 'sold' ? (
                    <div className="sold">
                        <h3>SOLD</h3>
                    </div>
                    ) : isOwner ? (
                        <p className="owner-notice"><em>This is your listing.</em></p>
                    ) : (
                        <button type="button" onClick={handleBuy} className="buy-now-btn">
                            Buy Now!
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProductListing;
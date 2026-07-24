import React, { useState, useEffect } from 'react';
import "../CSS/Profile.css";

function Profile({ userId = 1, currentUser, setCurrentPage }) {
    const [profile, setProfile] = useState({name: "", email: "", bio: ""});
    const [activeListings, setActiveListings] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({name: "", bio: ""});
    const [ratingData, setRatingData] = useState({ average: 0, count: 0 });
    const [selectedListing, setSelectedListing] = useState(0);
    const [userScore, setUserScore] = useState(0);
    const [reviewComment, setReviewComment] = useState("");

    const isOwner = currentUser && currentUser.id === Number(userId);

    useEffect(() => {
        fetch(`http://localhost:3000/api/profile/${userId}`)
        .then(res => res.json())
        .then(data => {
            if (data.user) {
                setProfile(data.user);
                setActiveListings(data.listings || []);
            }
        })
        .catch(err => {
            console.error("Error fetching profile:", err);
        });
    }, [userId]);

    useEffect(() => {
        fetch(`http://localhost:3000/api/reviews/${userId}`)
        .then(res => res.json())
        .then(data => {
            setRatingData(data);
        })
        .catch(err => {
            console.error("Error fetching reviews:", err);
        });
    }, [userId]);

    const handleEditClick = () => {
        setEditData({name: profile.name, bio: profile.bio || ""});
        setIsEditing(!isEditing);
    };

    const handleSave = (e) => {
        e.preventDefault();
        fetch(`http://localhost:3000/api/profile/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData)
        })
        .then(res => res.json())
        .then(data => {
            setProfile(prev => ({ ...prev, name: editData.name, bio: editData.bio }));
            setIsEditing(false);
            alert(data.message || "Profile updated!");
        })
        .catch(err => console.error("Error updating profile:", err));
    };

    const handleReviewSubmit = () => {
        fetch(`http://localhost:3000/api/reviews/${userId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                reviewerId: currentUser.id,
                listingId: selectedListing,
                rating: userScore,
                comment: reviewComment
            })
        })
        .then(res => res.json())
        .then(() => {
            setSelectedListing(0);
            setUserScore(0);
            setReviewComment("");
            return fetch(`http://localhost:3000/api/reviews/${userId}`)
                .then(res => res.json())
                .then(data => setRatingData(data));
        })
        .catch(err => console.error("Error submitting review:", err));
    }

    const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      fetch(`http://localhost:3000/api/profile/${userId}`, { method: "DELETE" })
        .then(res => res.json())
        .then(data => {
          alert(data.message || "Account deleted!");
          if (setCurrentPage) setCurrentPage("Login");  //goes back to login menu after you deleted the account
        })
        .catch(err => console.error("Error deleting account:", err));
    }
  };

    // DELETES ACTIVE LISTINGS
    const handleDeleteListing = (id) => {
        if (window.confirm("Delete this listing?")) {
            fetch(`http://localhost:3000/api/listings/${id}`, { method: "DELETE" })
            .then(res => res.json())
            .then(data => {
                setActiveListings(activeListings.filter(item => item.id !== id));
                alert(data.message || "Listing deleted!");
            })
            .catch(err => console.error("Error deleting listing:", err));
        }
    };

    return (
        <div className="profile-container">
            <div className="profile-card-grid">
                <div className="profile-left-col">
                    <h1 className="user-name-title">{profile.name}</h1>
                    {isOwner &&(
                        <div className="edit-profile-header">
                            <span>Edit Profile:</span>
                            <button type="button" className="edit-toggle-btn" onClick={handleEditClick}>
                                {isEditing ? "Cancel" : "Edit"}
                            </button>
                        </div>
                    )}
                    {!isEditing ? (
                        <>
                        <div className="profile-pic-box">
                            <div className="avatar-placeholder">
                                {profile.name.charAt(0).toUpperCase()}
                            </div>
                        </div>

                        <div className="about-me-section">
                            <h3>About Me:</h3>
                            <p className="bio-text">{profile.bio}</p>
                        </div>

                        <div className="reviews-section">
                            <h3>Reviews:</h3>
                            {ratingData.count > 0 ? (
                                <p> <strong>{Number(ratingData.average).toFixed(1)}/5</strong> star average from <strong>{ratingData.count}</strong> reviews</p>
                            ) : (
                                <p className="no-reviews">No reviews yet.</p>
                            )}
                        </div>

                        {!isOwner && (
                            <div className="leave-review-box">
                                <h3>Leave a review</h3>
                                <label>Which listing?</label>
                                <select value={selectedListing} onChange={(e) => setSelectedListing(Number(e.target.value))}>
                                    <option value={0}>Select a listing</option>
                                    {activeListings.map(item => (
                                        <option key={item.id} value={item.id}>{item.title}</option>
                                    ))}
                                </select>

                                <label>Rating:</label>
                                <select value={userScore} onChange={(e) => setUserScore(Number(e.target.value))}>
                                    <option value={0}>Select</option>
                                    {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                                </select>

                                <textarea
                                    placeholder="Leave a comment (optional)"
                                    value={reviewComment}
                                    onChange={(e) => setReviewComment(e.target.value)}
                                />

                                <button type="button" onClick={handleReviewSubmit} disabled={!selectedListing || !userScore}>
                                    Submit Review
                                </button>
                            </div>
                        )}

                        {isOwner && (
                            <button type="button" className="delete-account-btn" onClick={handleDeleteAccount}>Delete Account</button>
                        )}
                        </>
                    ):(
                        /* EDITING MODE */
                        <form onSubmit={handleSave} className="edit-form">
                            <div className="input-group">
                                <label>Name:</label>
                                <input
                                type="text"
                                name="name"
                                className="input-field"
                                value={editData.name}
                                onChange={(e) => setEditData({ ...editData, name: e.target.value })}/>
                            </div>

                            <div className="input-group">
                                <label>About Me:</label>
                                <textarea
                                name="bio"
                                className="description-textarea"
                                value={editData.bio}
                                onChange={(e) => setEditData({ ...editData, bio: e.target.value })}/>
                            </div>

                            <button type="submit" className="save-btn">Save Changes</button>
                        </form>
                    )}
                </div>

                {/*ACTIVE LISTINGS */}
                <div className="profile-right-col">
                    <h2>Active Listings</h2>
                    <div className="active-listings-box">
                        {activeListings.length > 0 ? (
                            <ul className="listings-list">
                                {activeListings.map(item => (
                                    <li key={item.id} className="listing-item">
                                        <div className = "listing-info">
                                            <span className="item-title">{item.title}</span>
                                            <span className="item-price">{item.price}</span>
                                        </div>
                                        {isOwner && (
                                            <button type="button" className="delete-item-btn" onClick={() => handleDeleteListing(item.id)}>x</button>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        ):(
                            <p className="no-listings">No active listings yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
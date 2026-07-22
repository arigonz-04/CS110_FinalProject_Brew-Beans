import React, { useState } from 'react';


function Card({title,condition,price,image_url,product_id, onSelectListing, status}){
    const handleClick = (e) => {
        e.preventDefault();
        if (onSelectListing) {
            onSelectListing(product_id);
        }
    };

return(

<div className='card'
    onClick={handleClick}
    style={{cursor: 'pointer', opacity: status === 'sold' ? 0.6:1}}
>

<div className="image">
<img src={image_url} alt={title}/>

<div className='card-text'>
    <h3 className='title'>{title}</h3>
    <p className='condition'>{condition}</p>
    <p className='price'>${price}</p>
    {status === 'sold' && (
        <span style={{color: 'black', fontWeight: 'bold'}} >SOLD</span>
    )}
</div>

</div>
</div>

);

};

export default Card;
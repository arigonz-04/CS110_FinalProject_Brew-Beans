import React, { useState } from 'react';


function Card({title,condition,price,image_url,product_id}){

return(

<div className='card'>

<div className="image">
<img src={image_url} alt={title}/>

<div className='card-text'>
    <a className='title' href={`/products/${product_id}`}>{title}</a>
    <p className='condition'>{condition}</p>
    <p className='price'>{price}</p>
</div>

</div>
</div>

);

};

export default Card;
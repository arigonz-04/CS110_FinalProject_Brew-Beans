import React, { useState } from 'react';


function Grid({count}) {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/listings');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    }, 
    []); 

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;


    return (
        <div className ="container">

         {data.map((item) => (
                   <Card product_id ={item.id} title={item.title} condition={item.condition} price={item.price} image_url={item.image_url}/>
                ))}
        </div>
    );

}

export default Grid;
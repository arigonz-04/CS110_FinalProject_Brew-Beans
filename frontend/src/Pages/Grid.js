import React, { useState, useEffect } from 'react';
import Card from './Card';


function Grid({filters = {}}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (filters?.search) queryParams.append('q', filters.search);
        if (filters?.minprice) queryParams.append('minprice', filters.minprice);
        if (filters?.maxprice) queryParams.append('maxprice', filters.maxprice);

        const categories = [];
        if (filters?.['Coffee Beans']) categories.push('Coffee Beans');
        if (filters?.['Espresso Machines']) categories.push('Espresso Machines');
        if (filters?.['Syrups']) categories.push('Syrups');
        if (filters?.['Accessories']) categories.push('Accessories');

        if (categories.length > 0) {
          queryParams.append('categories', categories.join(','));
        }

        const response = await fetch(`http://localhost:3000/api/listings?${queryParams.toString()}`)

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();

        if (Array.isArray(result)) {
          setData(result);
        } else {
          console.error("Expected array from API but got:", result);
          setData([]);
          if (result.message || result.error) {
            setError(result.message || result.error);
          }
        }
      } catch (err) {
        setError(err.message);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    }, 
    [filters]); 

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;


    return (
        <div className ="container">
          {!Array.isArray(data) || data.length === 0 ? (
            <p>No listings match your filters</p> 
          ): (
            data.map((item) => (
              <Card
              key = {item.id} product_id={item.id} title={item.title} condition={item.condition} price={item.price} image_url={item.image_url}
              />
            ))
          )}
        </div>
    );
}

export default Grid;
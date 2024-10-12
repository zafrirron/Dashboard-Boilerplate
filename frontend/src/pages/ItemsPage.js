import React, { useEffect, useState } from 'react';

const ItemsPage = () => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      const token = localStorage.getItem('token');  // Get JWT token from localStorage
      console.log('Sending token:', token);  // Log the token sent from frontend

      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/api/items`, {
          headers: {
            'Authorization': `Bearer ${token}`,  // Attach the token in the Authorization header
          },
        });

        if (response.ok) {
          const data = await response.json();
          setItems(data.data);  // Assuming the API returns items in data.data
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Failed to fetch items.');
          console.log('Error response:', errorData);  // Log the error response for debugging
        }
      } catch (err) {
        setError('Error fetching items.');
        console.error(err);
      }
    };

    fetchItems();
  }, []);

  return (
    <div>
      <h1>Items</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {items.map((item) => (
          <li key={item.id}>{item.name} - {item.description}</li>
        ))}
      </ul>
    </div>
  );
};

export default ItemsPage;

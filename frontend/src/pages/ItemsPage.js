import React, { useEffect, useState } from 'react';

function ItemsPage() {
  const [items, setItems] = useState([]);  // Initialize as an empty array

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/api/items`);
        const data = await response.json();

        // Handle cases where the data is not an array
        if (Array.isArray(data)) {
          setItems(data);  // If the response is directly an array
        } else if (data && Array.isArray(data.data)) {
          setItems(data.data);  // If the response is an object with a data array
        } else {
          console.error("Unexpected data format:", data);
          setItems([]);  // Default to an empty array if the response is not what we expect
        }
      } catch (error) {
        console.error('Error fetching items:', error);
        setItems([]);  // In case of an error, default to an empty array
      }
    };

    fetchItems();
  }, []);

  return (
    <div>
      <h1>Items</h1>
      <ul>
        {/* Only attempt to map items if it's an array */}
        {items.length > 0 ? (
          items.map(item => (
            <li key={item.id}>{item.name}</li>
          ))
        ) : (
          <p>No items available</p>  // Display a message if no items are available
        )}
      </ul>
    </div>
  );
}

export default ItemsPage;

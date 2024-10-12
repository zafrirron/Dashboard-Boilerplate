import React, { useEffect, useState } from 'react';

const UserProfilePage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch('http://localhost:5000/api/auth/me', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setUser(data);
    };
    fetchUser();
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Your Profile</h1>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
      <p>Account Active: {user.active ? 'Yes' : 'No'}</p>
      <p>Account Created: {user.createdAt}</p>
    </div>
  );
};

export default UserProfilePage;

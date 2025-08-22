// src/components/Members/MembersNavbar.js
import React from 'react';

const MembersNavbar = () => {
  return (
    <nav>
      <ul>
        <li><a href="/members">Dashboard</a></li>
        <li><a href="/class-registration">Class Registration</a></li>
        <li><a href="/profile">Profile</a></li>
        {/* Add other links here */}
      </ul>
    </nav>
  );
};

export default MembersNavbar;

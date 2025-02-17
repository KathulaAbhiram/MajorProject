import React, { useState,useEffect } from "react";
import { useQuery, useLazyQuery, gql } from "@apollo/client";
import "./dashboard.css";
//import { data } from "react-router-dom";

console.log('Hello url',process.env.REACT_APP_URRI,process.env.REACT_APP_ORI)

const GET_ALL_USERS = gql`
  query {
    getUsers {
      id
      name
    }
  }
`;

const GET_USER_BY_ID = gql`
  query ($id: ID!) {    
    getUserById(id: $id) {
      id
      name
      email
    }
  }
`;

const Dashboard = () => {
  const [userId, setUserId] = useState("");

  const { data: allUsersData, loading: allUsersLoading,error:allerror } = useQuery(GET_ALL_USERS);
  const [getUserById, { data: userData, loading: userLoading,error:oneerror  }] = useLazyQuery(GET_USER_BY_ID);
  const handleSearch = () => {
    console.log("Entered id--",userId)
    if (userId.trim() === "") {
      alert("Please enter a user ID.");
      return;
    }
    getUserById({ variables: { id: userId } }).then((result) => {
      console.log("GraphQL Response:", result);
    }).catch((error) => {
      console.error("GraphQL Query Error:", error);
    });
  };


  return (
    <div className="profile-container">
      <div className="image-container">
        <img
          src="https://static.vecteezy.com/system/resources/previews/029/364/941/non_2x/3d-carton-of-boy-going-to-school-ai-photo.jpg" // Replace with your image URL
          alt="Profile"
          className="profile-image"
        />
      </div>
      <div className="search-container">
        <input
          type="text"
          placeholder="Enter user ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <button onClick={handleSearch}>Get User</button>
      </div>

      <div className="data-container">
        <h2>User Information</h2>
        {console.log("One",userData)}
        {userLoading ? (
          <p>Loading...</p>
        ) : userData?.getUserById[0] ? (
          <div>
            <p><strong>ID:</strong> {userData.getUserById[0].id}</p>
            <p><strong>Name:</strong> {userData.getUserById[0].name}</p>
            <p><strong>Age:</strong> {userData.getUserById[0].email}</p>
          </div>
        ) : (
          <p>No user found</p>
        )}
      </div>

      <div className="data-container">
        <h2>All Users</h2>
        {console.log("All",allUsersData)}
        {allUsersLoading ? (
          <p>Loading users...</p>
        ) : (
          allUsersData?.getUsers?.map((user) => (
            <div key={user.id}>
              <p>{user.id} - {user.name}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;

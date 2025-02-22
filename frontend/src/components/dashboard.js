import React, { useState,useEffect, use } from "react";
import { useQuery, useLazyQuery, gql,useMutation } from "@apollo/client";
import "./dashboard.css";
import { useNavigate } from 'react-router-dom';
import AppointmentModal from "./appModal";


console.log('Hello url',process.env.REACT_APP_URRI,process.env.REACT_APP_ORI)
//Graphql Queries
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
const GET_APPOINTMENTS = gql`
  query ($userId: ID!) {    
    getAppointments(userId: $userId) {
      id
      userId
      doctorId
      status
      time
    }
  }
`;
const BOOK_APPOINTMENT = gql`
  mutation ($userId: ID!, $doctorId: ID!, $time: String!) {
    bookAppointment(userId: $userId, doctorId: $doctorId, time: $time) {
      id
      userId
      doctorId
      time
      status
    }
  }
`;
const GET_FAVORITES = gql`
  query ($userId: ID!) {    
    getFavorites(userId: $userId) {
      id
      userId
      favoriteDoctorId
    }
  }
`;
const ADD_TO_FAV=gql`
  mutation($userId:ID!,$doctorId:ID!){
    addToFavorites(userId:$userId,doctorId:$doctorId){
      id
      userId
      favoriteDoctorId
    }
  }
`

const Dashboard = () => {
  const uid=sessionStorage.getItem("userId")
  console.log("Got hete",uid)
  const [ouser,setOUser]=useState("")
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [favModalOpen, setFavModalOpen] = useState(false);
  const [getmyappclicked,setGetmyappclicked]=useState(false)

  const { data: allUsersData, loading: allUsersLoading,error:allerror } = useQuery(GET_ALL_USERS);
  const [getUserById, { data: userData, loading: userLoading,error:oneerror  }] = useLazyQuery(GET_USER_BY_ID);  
  const [getAppointments, { data: appoData, loading: appoLoading, error: appoerror }] = useLazyQuery(GET_APPOINTMENTS);
  const [bookAppointment, { data: bookData, error: bookError }] = useMutation(BOOK_APPOINTMENT);
  const { data: favData, loading: favLoading, error: faverror } = useQuery(GET_FAVORITES,{variables:{userId:uid}});
  const [addToFavorites, { data: adddfavData, error: addfavError }] = useMutation(ADD_TO_FAV);

  const brohandle=async(eventName)=>{
    //We control search
    console.log("LOG--- ",eventName,' ---LOG','BB')
    let t=new Date().toISOString()
    await fetch(`https://cloudfuncdep.azurewebsites.net/api/LogEvents?userid=${uid}&event_name=${eventName}&timestamp=${t}`, {
      mode: 'no-cors',
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({userid: uid, event_name: eventName, timestamp: new Date().toISOString() })
      }
    )
  }
  
  const smallbrohandle=async(eventName)=>{
    //We control logout,getappointments
    console.log("LOG--- ",eventName,' ---LOG','SB')
    let t=new Date().toISOString()
    await fetch(`https://cloudfuncdep.azurewebsites.net/api/LogEvents?userid=${uid}&event_name=${eventName}&timestamp=${t}`, {
      mode: 'no-cors',
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({userid: uid, event_name: eventName, timestamp: new Date().toISOString() })
      }
    )
  }

  const handleSearch = () => {
    console.log("Entered id--",ouser)
    if (ouser.trim() === "") {
      alert("Please enter a user ID.");
      return;
    }
    getUserById({ variables: { id: ouser } }).then((result) => {
      console.log("GraphQL Response:", result);
    }).catch((error) => {
      console.error("GraphQL Query Error:", error);
    });
  };

  const handleAppointment = async (action,doctorId,time) => {
    const eve_name= action === 1 ? "book_appointment" : "get_appointments"
    smallbrohandle(eve_name)

    if (!getmyappclicked) {
      setGetmyappclicked(true);  // Update state once when the button is clicked
    }
    console.log("clik btn-",getmyappclicked)    
    //let userId
    action === 1
        ? bookAppointment({ variables: { userId:uid, doctorId:doctorId, time: time } })
        : getAppointments({ variables: { userId:uid } });
  };

  useEffect(() => {
    if (getmyappclicked) {
      getAppointments({ variables: {userId: uid } });
    }
  }, [getmyappclicked, getAppointments, uid]);
  

  const handleBookAppointmentClick = () => {
    setIsModalOpen(true); // Show modal when the button is clicked    
    brohandle("book_appointments")
  };

  const handleAddToFavorites = async() => {
    //Log
    brohandle("favorites")
    setFavModalOpen(true); // Show modal when the button is clicked
    let doctorId=prompt("Enter doctor")
    console.log("updating fav",uid,doctorId)
    addToFavorites({variables:{uid,doctorId}})  
  };

  const handleModalSubmit = (details) => {
    console.log("Got",details)
    handleAppointment(1, details.userId, details.doctorId, details.time); // Book the appointment
    setIsModalOpen(false);
  };

  const handleLogout = async () => {   
    navigate('/');   
  };
  

  
  return (
    <div className="comppage">
      <div className="image-container">
        <img
          src="https://static.vecteezy.com/system/resources/previews/029/364/941/non_2x/3d-carton-of-boy-going-to-school-ai-photo.jpg" // Replace with your image URL
          alt="Profile"
          className="profile-image"
        />
        <button onClick={()=>{handleLogout(); smallbrohandle("logout"); }}>LogOut</button>
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder="Enter user ID"
          value={ouser}
          onChange={(e) => setOUser(e.target.value)}
        />
        <button onClick={()=>{ handleSearch(); brohandle("searchothers"); }}>Get User</button>        
      </div>

      <div className="data-container">
        <h2>User Information</h2>
        {console.log("One",userData)}
        {userLoading ? (<p>Loading...</p>) : userData?.getUserById[0] ? (
          <div>
            <p><strong>ID:</strong> {userData.getUserById[0].id}</p>
            <p><strong>Name:</strong> {userData.getUserById[0].name}</p>
            <p><strong>Age:</strong> {userData.getUserById[0].email}</p>
          </div>
        ) : (<p>No user found</p>)}
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

      <div className="data-container">
        <button onClick={() => handleAppointment(0,"","")}>Get My Appointments</button>
        <button onClick={handleBookAppointmentClick}>Book Appointment</button> 

        <button onClick={handleAddToFavorites}>Add to favs</button>
        {isModalOpen && (
          <AppointmentModal
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleModalSubmit}
          />
        )}
      </div>

      <h3>Appointment Information</h3>
      <div className="app-container">        
        {getmyappclicked&&appoData ? (
          <ul>
            {console.log('Appointment Data----',appoData)}
            {appoData.getAppointments?.map((appointment, index) => (
              <div className="a-container"><li key={index}>
                <p><strong>User ID:</strong> {appointment.userId}</p>
                <p><strong>Doctor ID:</strong> {appointment.doctorId}</p>
                <p><strong>Appointment Time:</strong> {appointment.time}</p>
              </li>
              </div>
            ))}
          </ul>
        ) : (
          <p>----</p>
        )}
      </div>

      <h3>Favorites Data</h3>
      <div className="app-container">        
        {favData ? (
          <ul>
            {console.log("Favorites Data---",favData)}
            {favData.getFavorites?.map((fav, index) => (
              <div className="a-container"><li key={index}>
                <p><strong>ID:</strong> {fav.id}</p>
                <p><strong>User ID:</strong> {fav.userId}</p>
                <p><strong>Doctor ID:</strong> {fav.favoriteDoctorId}</p>
              </li>
              </div>
            ))}
          </ul>
        ) : (
          <p>*********</p>
        )}
      </div>

    </div>
  );
};

export default Dashboard;

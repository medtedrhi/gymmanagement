import React, { useState, useRef, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import './MembersDashboard.css';

const MemberDashboard = () => {
  // États pour les fenêtres offcanvas
  const [showProfileCanvas, setShowProfileCanvas] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showPaymentsCanvas, setShowPaymentsCanvas] = useState(false);
  const [showFeedbackCanvas, setShowFeedbackCanvas] = useState(false);
  const [showCoachProfileCanvas, setShowCoachProfileCanvas] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [userName, setUserName] = useState('');

  // Données utilisateur
  const [userProfile, setUserProfile] = useState({
    id: '',
    name: '',
    email: '',
  });

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        const response = await fetch('http://localhost:8000/api/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setUserProfile({
            id: data.id,
            name: data.name,
            email: data.email,
          });
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  // State for coaches
  const [coaches, setCoaches] = useState([]);

  // Données locales pour les classes
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        const response = await fetch('http://localhost:8000/api/classes', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          // Filter only upcoming classes
          const currentDate = new Date();
          const upcomingClasses = data.filter(classe => {
            const classDateTime = new Date(classe.date + ' ' + classe.time);
            return classDateTime > currentDate;
          });
          
          // Sort classes by date and time
          upcomingClasses.sort((a, b) => {
            const dateA = new Date(a.date + ' ' + a.time);
            const dateB = new Date(b.date + ' ' + b.time);
            return dateA - dateB;
          });
          
          setSessions(upcomingClasses);
        }
      } catch (error) {
        console.error('Error fetching sessions:', error);
      }
    };

    fetchClasses();
  }, []);

  // Historique des paiements
  const paymentHistory = [
    { id: 1, date: '2024-01-15', amount: '$50', status: 'Paid' },
    { id: 2, date: '2024-02-15', amount: '$50', status: 'Paid' },
  ];

  // Refs for offcanvas popups
  const profileCanvasRef = useRef();
  const paymentsCanvasRef = useRef();
  const feedbackCanvasRef = useRef();
  const coachProfileCanvasRef = useRef();

  // Fonctions pour gérer les fenêtres offcanvas
  const toggleProfileCanvas = () => setShowProfileCanvas(prev => !prev);
  const togglePaymentsCanvas = () => setShowPaymentsCanvas(prev => !prev);
  const toggleFeedbackCanvas = () => setShowFeedbackCanvas(prev => !prev);
  const toggleCoachProfileCanvas = () => setShowCoachProfileCanvas(prev => !prev);

  // Gérer les modifications dans le formulaire du profil utilisateur
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserProfile({ ...userProfile, [name]: value });
  };

  // Sauvegarder les modifications du profil utilisateur
  const saveProfileChanges = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to update your profile');
        return;
      }

      // Validate the form data
      if (!userProfile.name || !userProfile.email) {
        alert('Name and email are required');
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userProfile.email)) {
        alert('Please enter a valid email address');
        return;
      }

      console.log('Sending update request with data:', userProfile);
      const response = await fetch(`http://localhost:8000/api/users/${userProfile.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: userProfile.name,
          email: userProfile.email,
        }),
      });

      const data = await response.json();
      console.log('Response from server:', data);
      
      if (response.ok) {
        setUserProfile({
          id: data.id,
          name: data.name,
          email: data.email,
        });
        setIsEditingProfile(false);
        setUserName(data.name); // Update the navbar name
        alert('Profile updated successfully!');
      } else {
        if (response.status === 422) {
          // Validation errors
          const errors = Object.values(data.errors || {}).flat().join('\n');
          alert(`Please correct the following errors:\n${errors}`);
        } else if (response.status === 401) {
          alert('Your session has expired. Please login again.');
          // You might want to redirect to login page here
        } else {
          alert(data.message || 'Error updating profile');
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  // Voir le profil d'un coach
  const handleCoachProfile = (coachId) => {
    const coach = coaches.find((c) => c.id === coachId);
    setSelectedCoach(coach);
    toggleCoachProfileCanvas();
  };

  // Sélectionner une séance
  const handleSessionSelect = (sessionId) => {
    const session = sessions.find((s) => s.id === sessionId);
    alert(`Vous avez choisi la séance : ${session.name} à ${session.time}`);
  };

  // Dismiss offcanvas by clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (showProfileCanvas && profileCanvasRef.current && !profileCanvasRef.current.contains(event.target)) {
        setShowProfileCanvas(false);
      }
      if (showPaymentsCanvas && paymentsCanvasRef.current && !paymentsCanvasRef.current.contains(event.target)) {
        setShowPaymentsCanvas(false);
      }
      if (showFeedbackCanvas && feedbackCanvasRef.current && !feedbackCanvasRef.current.contains(event.target)) {
        setShowFeedbackCanvas(false);
      }
      if (showCoachProfileCanvas && coachProfileCanvasRef.current && !coachProfileCanvasRef.current.contains(event.target)) {
        setShowCoachProfileCanvas(false);
      }
    }
    if (showProfileCanvas || showPaymentsCanvas || showFeedbackCanvas || showCoachProfileCanvas) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileCanvas, showPaymentsCanvas, showFeedbackCanvas, showCoachProfileCanvas]);

  // Fetch coaches data
  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        const response = await fetch('http://localhost:8000/api/users', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          // Filter users with role 'trainer'
          const trainers = data.filter(user => user.role === 'trainer');
          setCoaches(trainers);
        }
      } catch (error) {
        console.error('Error fetching coaches:', error);
      }
    };

    fetchCoaches();
  }, []);

  // Fetch username
  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const response = await fetch('http://localhost:8000/api/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUserName(data.name);
        }
      } catch (error) {}
    };
    fetchUserName();
  }, []);

  return (
    <div className="member-dashboard">
      {/* Navbar */}
      <Navbar userName={userName} />

      {/* Header */}
      <header id="header">
        <video src="C:\Users\USER\Desktop\gym\public\img\video.mp4" autoPlay loop muted className="header-video"></video>
        <div className="overlay"></div>
        <div className="container py-5 text-center">
          <h1 className="text-primary">Member Dashboard</h1>
          <p className="text-secondary">
            Gérez vos activités, choisissez vos séances et découvrez nos coachs.
          </p>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="dashboard-container container py-5">
        <div className="row">
          {/* Profile Section */}
          <div className="col-md-4">
            <div className="card section-card">
              <h2 className="card-title">Profile</h2>
              <p>View and update your profile information.</p>
              <button className="btn btn-primary" onClick={toggleProfileCanvas}>
                View Profile
              </button>
            </div>
          </div>

          {/* Payments Section */}
          <div className="col-md-4">
            <div className="card section-card">
              <h2 className="card-title">Payments</h2>
              <p>View your payment history or make a payment.</p>
              <button className="btn btn-primary" onClick={togglePaymentsCanvas}>
                View Payments
              </button>
            </div>
          </div>

          {/* Feedback Section */}
          <div className="col-md-4">
            <div className="card section-card">
              <h2 className="card-title">Feedback</h2>
              <p>Give us your feedback about the gym or classes.</p>
              <button className="btn btn-primary" onClick={toggleFeedbackCanvas}>
                Submit Feedback
              </button>
            </div>
          </div>

          {/* Sessions Section */}
          <div className="col-md-6 mt-4">
            <h2 className="text-primary">Classes Disponibles</h2>
            <ul className="list-group">
              {sessions.map((session) => (
                <li
                  key={session.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div className="d-flex flex-column">
                    <span className="fw-bold">{session.name}</span>
                    <span className="text-muted">
                      Date: {new Date(session.date).toLocaleDateString()}
                    </span>
                    <span className="text-muted">
                      Time: {session.time} (Coach: {session.coach})
                    </span>
                  </div>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleSessionSelect(session.id)}
                  >
                    Choisir
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Coaches Section */}
          <div className="col-md-6 mt-4">
            <h2 className="text-primary">Profils des Coachs</h2>
            <ul className="list-group">
              {coaches.map((coach) => (
                <li
                  key={coach.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <span>{coach.name}</span>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleCoachProfile(coach.id)}
                  >
                    Voir Profil
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Offcanvas for Profile */}
      <div
        ref={profileCanvasRef}
        className={`offcanvas offcanvas-end ${showProfileCanvas ? 'show' : ''}`}
        style={{ visibility: showProfileCanvas ? 'visible' : 'hidden' }}
      >
        <div className="offcanvas-header bg-primary text-white">
          <h5>Your Profile</h5>
          <button type="button" className="btn-close" onClick={toggleProfileCanvas}></button>
        </div>
        <div className="offcanvas-body">
          {isEditingProfile ? (
            <form>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-control"
                  value={userProfile.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control"
                  value={userProfile.email}
                  onChange={handleInputChange}
                />
              </div>

              <button type="button" className="btn btn-success" onClick={saveProfileChanges}>
                Save Changes
              </button>
              <button type="button" className="btn btn-secondary mx-2" onClick={() => setIsEditingProfile(false)}>
                Cancel
              </button>
            </form>
          ) : (
            <div>
              <p><strong>Name:</strong> {userProfile.name}</p>
              <p><strong>Email:</strong> {userProfile.email}</p>
              <button className="btn btn-warning" onClick={() => setIsEditingProfile(true)}>
                Edit Profile
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Offcanvas for Payments */}
      <div
        ref={paymentsCanvasRef}
        className={`offcanvas offcanvas-end ${showPaymentsCanvas ? 'show' : ''}`}
        style={{ visibility: showPaymentsCanvas ? 'visible' : 'hidden' }}
      >
        <div className="offcanvas-header bg-primary text-white">
          <h5>Payment History</h5>
          <button type="button" className="btn-close" onClick={togglePaymentsCanvas}></button>
        </div>
        <div className="offcanvas-body">
          <ul>
            {paymentHistory.map((payment) => (
              <li key={payment.id}>
                {payment.date} - {payment.amount} - {payment.status}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Offcanvas for Feedback */}
      <div
        ref={feedbackCanvasRef}
        className={`offcanvas offcanvas-end ${showFeedbackCanvas ? 'show' : ''}`}
        style={{ visibility: showFeedbackCanvas ? 'visible' : 'hidden' }}
      >
        <div className="offcanvas-header bg-primary text-white">
          <h5>Feedback</h5>
          <button type="button" className="btn-close" onClick={toggleFeedbackCanvas}></button>
        </div>
        <div className="offcanvas-body">
          <form>
            <div className="mb-3">
              <label htmlFor="feedback" className="form-label">Your Feedback</label>
              <textarea
                id="feedback"
                className="form-control"
                rows="4"
                placeholder="Your comments..."
              ></textarea>
            </div>
            <button type="button" className="btn btn-success">
              Submit Feedback
            </button>
          </form>
        </div>
      </div>

      {/* Offcanvas for Coach Profile */}
      <div
        ref={coachProfileCanvasRef}
        className={`offcanvas offcanvas-end ${showCoachProfileCanvas ? 'show' : ''}`}
        style={{ visibility: showCoachProfileCanvas ? 'visible' : 'hidden' }}
      >
        <div className="offcanvas-header bg-primary text-white">
          <h5>{selectedCoach ? selectedCoach.name : 'Coach Profile'}</h5>
          <button type="button" className="btn-close" onClick={toggleCoachProfileCanvas}></button>
        </div>
        <div className="offcanvas-body">
          {selectedCoach ? (
            <div>
              <p><strong>Name:</strong> {selectedCoach.name}</p>
              <p><strong>Email:</strong> {selectedCoach.email}</p>
              <div className="mt-3">
                <h6>Classes:</h6>
                <ul className="list-unstyled">
                  {selectedCoach.classes && selectedCoach.classes.map(classe => (
                    <li key={classe.id} className="mb-2">
                      <span className="fw-bold">{classe.name}</span>
                      <br />
                      <small className="text-muted">
                        {new Date(classe.class_date).toLocaleDateString()} at {classe.class_time}
                      </small>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <p>Select a coach to view their profile.</p>
          )}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MemberDashboard;

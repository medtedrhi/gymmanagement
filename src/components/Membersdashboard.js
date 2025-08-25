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
  const [payments, setPayments] = useState([]);

  // Données utilisateur
  const [userProfile, setUserProfile] = useState({
    id: '',
    name: '',
    email: '',
    subscription_status: '',
  });

  // Feedback form state (for testimonials)
  const [feedbackForm, setFeedbackForm] = useState({
    name: '',
    role: 'Member',
    message: '',
    rating: 5
  });
  const [feedbackStatus, setFeedbackStatus] = useState('');

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
            subscription_status: data.subscription_status || 'cancelled',
          });
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  // Handle feedback form changes
  const handleFeedbackFormChange = (e) => {
    const { name, value } = e.target;
    setFeedbackForm(prev => ({ ...prev, [name]: value }));
  };

  // Auto-fill name when user profile loads
  useEffect(() => {
    if (userProfile.name) {
      setFeedbackForm(prev => ({ ...prev, name: userProfile.name }));
    }
  }, [userProfile.name]);

  // Submit feedback (testimonial)
  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setFeedbackStatus('');
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setFeedbackStatus('Please log in to submit your testimonial');
        return;
      }

      const response = await fetch('http://localhost:8000/api/testimonials', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackForm),
      });

      if (response.ok) {
        setFeedbackStatus('Thank you for your testimonial! It has been submitted successfully.');
        setFeedbackForm({
          name: userProfile.name,
          role: 'Member',
          message: '',
          rating: 5
        });
        setTimeout(() => {
          setFeedbackStatus('');
          setShowFeedbackCanvas(false);
        }, 2000);
      } else {
        const data = await response.json();
        setFeedbackStatus(data.message || 'Failed to submit testimonial. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting testimonial:', error);
      setFeedbackStatus('Error submitting testimonial. Please try again.');
    }
  };

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
            const classDateTime = new Date(classe.class_date + ' ' + classe.class_time);
            return classDateTime > currentDate;
          });
          
          // Sort classes by date and time
          upcomingClasses.sort((a, b) => {
            const dateA = new Date(a.class_date + ' ' + a.class_time);
            const dateB = new Date(b.class_date + ' ' + b.class_time);
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

  // Historique des paiements - Remove static data
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        const response = await fetch('http://localhost:8000/api/payments', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          // Filter payments for current user
          const userPayments = data.filter(payment => payment.user_id === userProfile.id);
          setPayments(userPayments);
        }
      } catch (error) {
        console.error('Error fetching payments:', error);
      }
    };

    if (userProfile.id) {
      fetchPayments();
    }
  }, [userProfile.id]);
  // Refs for offcanvas popups
  const profileCanvasRef = useRef();
  const paymentsCanvasRef = useRef();
  const feedbackCanvasRef = useRef();
  const coachProfileCanvasRef = useRef();

  // Fonctions pour gérer les fenêtres offcanvas
  const toggleProfileCanvas = () => setShowProfileCanvas(prev => !prev);
  const togglePaymentsCanvas = () => setShowPaymentsCanvas(prev => !prev);
  const toggleFeedbackCanvas = () => {
    setShowFeedbackCanvas(prev => !prev);
    // Clear feedback status when closing
    if (showFeedbackCanvas) {
      setFeedbackStatus('');
    }
  };
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
  const handleSessionSelect = async (sessionId) => {
    try {
      // Increment participants count
      await fetch(`http://localhost:8000/api/classes/${sessionId}/increment-participants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Update the session in local state
      setSessions(prevSessions => 
        prevSessions.map(session => 
          session.id === sessionId 
            ? { ...session, participants_count: session.participants_count + 1 }
            : session
        )
      );

      const session = sessions.find((s) => s.id === sessionId);
      alert(`Vous avez choisi la séance : ${session.name} à ${session.class_time}. Participants: ${session.participants_count + 1}`);
    } catch (error) {
      console.error('Erreur lors de l\'inscription à la séance:', error);
      alert('Erreur lors de l\'inscription à la séance');
    }
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

      {/* Subscription Status Banner */}
      {userProfile.subscription_status !== 'active' && (
        <div className="container">
          <div className={`alert text-center ${
            userProfile.subscription_status === 'expired' 
              ? 'alert-danger' 
              : 'alert-warning'
          }`} style={{
            background: userProfile.subscription_status === 'expired' 
              ? 'linear-gradient(135deg, #F8D7DA 0%, #F5C6CB 100%)'
              : 'linear-gradient(135deg, #FFF3CD 0%, #FFEAA7 100%)',
            border: userProfile.subscription_status === 'expired' 
              ? '2px solid #DC3545' 
              : '2px solid #F39C12',
            borderRadius: '15px',
            margin: '20px 0',
            boxShadow: userProfile.subscription_status === 'expired' 
              ? '0 4px 15px rgba(220, 53, 69, 0.2)'
              : '0 4px 15px rgba(243, 156, 18, 0.2)'
          }}>
            <h5 className="alert-heading" style={{ 
              color: userProfile.subscription_status === 'expired' ? '#721C24' : '#E67E22', 
              fontWeight: 'bold' 
            }}>
              <i className={`fas ${
                userProfile.subscription_status === 'expired' 
                  ? 'fa-times-circle' 
                  : 'fa-exclamation-triangle'
              } me-2`}></i>
              {userProfile.subscription_status === 'expired' 
                ? 'Subscription Expired' 
                : 'Account Activation Required'
              }
            </h5>
            <p className="mb-3" style={{ 
              color: userProfile.subscription_status === 'expired' ? '#721C24' : '#D68910' 
            }}>
              {userProfile.subscription_status === 'expired' ? (
                <>
                  Your subscription has <strong>expired</strong>. All gym features have been disabled.
                  To continue enjoying our services, please visit our gym location and renew your membership.
                </>
              ) : (
                <>
                  Your account is currently <strong>{userProfile.subscription_status}</strong>. 
                  To activate your membership and access all gym features, please visit our gym location and complete your payment with our staff.
                </>
              )}
            </p>
            <div className="d-flex flex-column align-items-center gap-3">
              <div className="text-center" style={{ 
                fontSize: '0.95em', 
                color: userProfile.subscription_status === 'expired' ? '#721C24' : '#D68910' 
              }}>
                <i className="fas fa-map-marker-alt me-2"></i>
                <strong>
                  {userProfile.subscription_status === 'expired' 
                    ? 'Visit us at the gym to renew your membership' 
                    : 'Visit us at the gym to activate your account'
                  }
                </strong>
              </div>
              <div className="text-center" style={{ 
                fontSize: '0.9em', 
                color: userProfile.subscription_status === 'expired' ? '#5A1A1A' : '#A0790F' 
              }}>
                <i className="fas fa-info-circle me-2"></i>
                Our staff will process your payment and immediately {
                  userProfile.subscription_status === 'expired' 
                    ? 'reactivate your account' 
                    : 'activate your account'
                }
              </div>
            </div>
          </div>
        </div>
      )}

      {userProfile.subscription_status === 'active' && (
        <div className="container">
          <div className="alert alert-success text-center" style={{
            background: 'linear-gradient(135deg, #D4F1D4 0%, #A8E6CF 100%)',
            border: '2px solid #2ECC71',
            borderRadius: '15px',
            margin: '20px 0',
            boxShadow: '0 4px 15px rgba(46, 204, 113, 0.2)'
          }}>
            <h5 className="alert-heading" style={{ color: '#27AE60', fontWeight: 'bold' }}>
              <i className="fas fa-check-circle me-2"></i>
              Active Membership
            </h5>
            <p className="mb-0" style={{ color: '#229954' }}>
              Your membership is active! Enjoy all our gym facilities and services.
            </p>
          </div>
        </div>
      )}

      {/* Dashboard Content */}
      <div className="dashboard-container container py-5">
        <div className="row">
          {/* Profile Section */}
          <div className="col-md-4">
            <div 
              className="card section-card" 
              style={{
                background: 'linear-gradient(135deg, #F8F9FA 0%, #E9ECEF 100%)',
                border: '2px solid #007BFF',
                borderRadius: '15px',
                boxShadow: '0 8px 25px rgba(0, 123, 255, 0.15)'
              }}
            >
              <h2 className="card-title" style={{ color: '#007BFF', fontWeight: 'bold' }}>Profile</h2>
              <p style={{ color: '#4A4A4A' }}>View and update your profile information.</p>
              <button 
                className="btn"
                onClick={toggleProfileCanvas}
                style={{
                  background: 'linear-gradient(135deg, #007BFF 0%, #38B6FF 100%)',
                  color: '#F8F9FA',
                  border: 'none',
                  borderRadius: '25px',
                  padding: '12px 24px',
                  fontWeight: 'bold',
                  boxShadow: '0 5px 15px rgba(0, 123, 255, 0.3)'
                }}
              >
                View Profile
              </button>
            </div>
          </div>

          {/* Payment History Section */}
          <div className="col-md-4">
            <div 
              className="card section-card"
              style={{
                background: 'linear-gradient(135deg, #E8F5E8 0%, #C8E6C9 100%)',
                border: '2px solid #2ECC71',
                borderRadius: '15px',
                boxShadow: '0 8px 25px rgba(46, 204, 113, 0.15)'
              }}
            >
              <h2 className="card-title" style={{ color: '#007BFF', fontWeight: 'bold' }}>Payment History</h2>
              <p style={{ color: '#4A4A4A' }}>View your payment history and account status.</p>
              <button 
                className="btn"
                onClick={togglePaymentsCanvas}
                style={{
                  background: 'linear-gradient(135deg, #2ECC71 0%, #27AE60 100%)',
                  color: '#F8F9FA',
                  border: 'none',
                  borderRadius: '25px',
                  padding: '12px 24px',
                  fontWeight: 'bold',
                  boxShadow: '0 5px 15px rgba(46, 204, 113, 0.3)'
                }}
              >
                View History
              </button>
            </div>
          </div>

          {/* Feedback Section */}
          <div className="col-md-4">
            <div 
              className="card section-card"
              style={{
                background: userProfile.subscription_status === 'active' 
                  ? 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)' 
                  : 'linear-gradient(135deg, #F5F5F5 0%, #E0E0E0 100%)',
                border: userProfile.subscription_status === 'active' 
                  ? '2px solid #38B6FF' 
                  : '2px solid #9E9E9E',
                borderRadius: '15px',
                boxShadow: userProfile.subscription_status === 'active' 
                  ? '0 8px 25px rgba(56, 182, 255, 0.15)' 
                  : '0 8px 25px rgba(158, 158, 158, 0.15)',
                opacity: userProfile.subscription_status === 'active' ? 1 : 0.6
              }}
            >
              <h2 className="card-title" style={{ color: '#007BFF', fontWeight: 'bold' }}>Share Your Experience</h2>
              <p style={{ color: '#4A4A4A' }}>Rate your experience and share a testimonial about our gym.</p>
              {userProfile.subscription_status !== 'active' && (
                <p className="text-warning" style={{ fontSize: '0.9em', fontStyle: 'italic' }}>
                  <i className="fas fa-lock me-1"></i>
                  Requires active subscription
                </p>
              )}
              <button 
                className="btn"
                onClick={userProfile.subscription_status === 'active' ? toggleFeedbackCanvas : null}
                disabled={userProfile.subscription_status !== 'active'}
                style={{
                  background: userProfile.subscription_status === 'active' 
                    ? 'linear-gradient(135deg, #38B6FF 0%, #1E88E5 100%)' 
                    : '#9E9E9E',
                  color: '#F8F9FA',
                  border: 'none',
                  borderRadius: '25px',
                  padding: '12px 24px',
                  fontWeight: 'bold',
                  boxShadow: userProfile.subscription_status === 'active' 
                    ? '0 5px 15px rgba(56, 182, 255, 0.3)' 
                    : 'none',
                  cursor: userProfile.subscription_status === 'active' ? 'pointer' : 'not-allowed'
                }}
              >
                Share Experience
              </button>
            </div>
          </div>

          {/* Inactive Member Information Section */}
          {userProfile.subscription_status !== 'active' && (
            <div className="col-12 mt-4">
              <div className="card" style={{
                background: userProfile.subscription_status === 'expired' 
                  ? 'linear-gradient(135deg, #F8D7DA 0%, #F5C6CB 100%)'
                  : 'linear-gradient(135deg, #FFF3CD 0%, #FFEAA7 100%)',
                border: userProfile.subscription_status === 'expired' 
                  ? '2px solid #DC3545' 
                  : '2px solid #F39C12',
                borderRadius: '15px',
                boxShadow: userProfile.subscription_status === 'expired' 
                  ? '0 8px 25px rgba(220, 53, 69, 0.2)'
                  : '0 8px 25px rgba(243, 156, 18, 0.2)',
                textAlign: 'center',
                padding: '40px 20px'
              }}>
                <div className="card-body">
                  <h3 style={{ 
                    color: userProfile.subscription_status === 'expired' ? '#721C24' : '#E67E22', 
                    fontWeight: 'bold', 
                    marginBottom: '20px' 
                  }}>
                    <i className={`fas ${
                      userProfile.subscription_status === 'expired' 
                        ? 'fa-times-circle' 
                        : 'fa-dumbbell'
                    } fa-2x mb-3`}></i>
                    <br />
                    {userProfile.subscription_status === 'expired' 
                      ? 'Membership Expired!' 
                      : 'Welcome to Our Gym!'
                    }
                  </h3>
                  <p style={{ 
                    color: userProfile.subscription_status === 'expired' ? '#721C24' : '#D68910', 
                    fontSize: '1.1em', 
                    marginBottom: '25px' 
                  }}>
                    {userProfile.subscription_status === 'expired' ? (
                      <>Your membership has expired. To regain access to all our amazing features:</>
                    ) : (
                      <>To unlock all our amazing features including:</>
                    )}
                  </p>
                  <div className="row mb-4">
                    <div className="col-md-4 mb-3">
                      <div style={{ 
                        color: userProfile.subscription_status === 'expired' ? '#5A1A1A' : '#A0790F' 
                      }}>
                        <i className="fas fa-calendar-alt fa-2x mb-2" style={{
                          opacity: userProfile.subscription_status === 'expired' ? 0.6 : 1
                        }}></i>
                        <h5>Class Booking</h5>
                        <p style={{ fontSize: '0.9em' }}>
                          {userProfile.subscription_status === 'expired' 
                            ? 'Renew to book classes again' 
                            : 'Book your favorite fitness classes'
                          }
                        </p>
                      </div>
                    </div>
                    <div className="col-md-4 mb-3">
                      <div style={{ 
                        color: userProfile.subscription_status === 'expired' ? '#5A1A1A' : '#A0790F' 
                      }}>
                        <i className="fas fa-user-friends fa-2x mb-2" style={{
                          opacity: userProfile.subscription_status === 'expired' ? 0.6 : 1
                        }}></i>
                        <h5>Coach Profiles</h5>
                        <p style={{ fontSize: '0.9em' }}>
                          {userProfile.subscription_status === 'expired' 
                            ? 'Renew to access trainer profiles' 
                            : 'Meet our professional trainers'
                          }
                        </p>
                      </div>
                    </div>
                    <div className="col-md-4 mb-3">
                      <div style={{ 
                        color: userProfile.subscription_status === 'expired' ? '#5A1A1A' : '#A0790F' 
                      }}>
                        <i className="fas fa-star fa-2x mb-2" style={{
                          opacity: userProfile.subscription_status === 'expired' ? 0.6 : 1
                        }}></i>
                        <h5>Share Testimonials</h5>
                        <p style={{ fontSize: '0.9em' }}>
                          {userProfile.subscription_status === 'expired' 
                            ? 'Renew to share your experience' 
                            : 'Rate and review your experience'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.8)',
                    padding: '20px',
                    borderRadius: '10px',
                    marginBottom: '20px'
                  }}>
                    <h4 style={{ 
                      color: userProfile.subscription_status === 'expired' ? '#721C24' : '#E67E22', 
                      fontWeight: 'bold' 
                    }}>
                      <i className="fas fa-map-marker-alt me-2"></i>
                      {userProfile.subscription_status === 'expired' 
                        ? 'Visit Our Gym to Renew' 
                        : 'Visit Our Gym Location'
                      }
                    </h4>
                    <p style={{ 
                      color: userProfile.subscription_status === 'expired' ? '#721C24' : '#D68910', 
                      fontSize: '1em' 
                    }}>
                      {userProfile.subscription_status === 'expired' ? (
                        <>
                          Come to our gym and renew your membership with our friendly staff. 
                          Your account will be reactivated immediately!
                        </>
                      ) : (
                        <>
                          Come to our gym and complete your membership payment with our friendly staff. 
                          Your account will be activated immediately!
                        </>
                      )}
                    </p>
                  </div>
                  <div className="d-flex justify-content-center gap-3">
                    <button 
                      className="btn btn-lg"
                      onClick={() => setShowPaymentsCanvas(true)}
                      style={{
                        background: userProfile.subscription_status === 'expired' 
                          ? 'linear-gradient(135deg, #DC3545 0%, #C82333 100%)'
                          : 'linear-gradient(135deg, #2ECC71 0%, #27AE60 100%)',
                        color: '#F8F9FA',
                        border: 'none',
                        borderRadius: '25px',
                        padding: '12px 30px',
                        fontWeight: 'bold',
                        boxShadow: userProfile.subscription_status === 'expired' 
                          ? '0 5px 15px rgba(220, 53, 69, 0.3)'
                          : '0 5px 15px rgba(46, 204, 113, 0.3)'
                      }}
                    >
                      <i className="fas fa-history me-2"></i>
                      View Payment History
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sessions Section - Only visible for active members */}
          {userProfile.subscription_status === 'active' && (
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
                        Date: {new Date(session.class_date).toLocaleDateString()}
                      </span>
                      <span className="text-muted">
                        Time: {session.class_time} (Coach: {session.trainer ? session.trainer.name : 'TBA'})
                      </span>
                    </div>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleSessionSelect(session.id)}
                      style={{
                        background: 'linear-gradient(135deg, #007BFF 0%, #38B6FF 100%)',
                        border: 'none'
                      }}
                    >
                      Choisir
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Coaches Section - Only visible for active members */}
          {userProfile.subscription_status === 'active' && (
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
                      style={{
                        background: 'linear-gradient(135deg, #6C757D 0%, #495057 100%)',
                        border: 'none'
                      }}
                    >
                      Voir Profil
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Offcanvas for Profile */}
      <div
        ref={profileCanvasRef}
        className={`offcanvas offcanvas-end ${showProfileCanvas ? 'show' : ''}`}
        style={{ visibility: showProfileCanvas ? 'visible' : 'hidden' }}
      >
        <div className="offcanvas-header" style={{
          background: 'linear-gradient(135deg, #007BFF, #38B6FF)',
          color: '#F8F9FA'
        }}>
          <h5 style={{ fontWeight: '600' }}>Your Profile</h5>
          <button type="button" className="btn-close btn-close-white" onClick={toggleProfileCanvas}></button>
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
        <div className="offcanvas-header" style={{
          background: 'linear-gradient(135deg, #2ECC71, #27AE60)',
          color: '#F8F9FA'
        }}>
          <h5 style={{ fontWeight: '600' }}>Payment History</h5>
          <button type="button" className="btn-close btn-close-white" onClick={togglePaymentsCanvas}></button>
        </div>
        <div className="offcanvas-body">
          <div className="mb-3 p-3" style={{
            background: userProfile.subscription_status === 'expired' 
              ? 'linear-gradient(135deg, #F8D7DA 0%, #F5C6CB 100%)'
              : 'linear-gradient(135deg, #FFF3CD 0%, #FFEAA7 100%)',
            border: userProfile.subscription_status === 'expired' 
              ? '1px solid #DC3545' 
              : '1px solid #F39C12',
            borderRadius: '10px'
          }}>
            <h6 style={{ 
              color: userProfile.subscription_status === 'expired' ? '#721C24' : '#E67E22', 
              fontWeight: 'bold' 
            }}>
              <i className="fas fa-info-circle me-2"></i>
              {userProfile.subscription_status === 'expired' ? 'Subscription Expired' : 'Payment Information'}
            </h6>
            <p style={{ 
              color: userProfile.subscription_status === 'expired' ? '#721C24' : '#D68910', 
              fontSize: '0.9em', 
              marginBottom: 0 
            }}>
              {userProfile.subscription_status === 'expired' ? (
                <>
                  Your subscription has expired. To renew your membership and regain access to all features, 
                  please visit our gym location. Our staff will process your payment and reactivate your account immediately.
                </>
              ) : (
                <>
                  To make payments, please visit our gym location. Our staff will process your payment and update your account immediately.
                </>
              )}
            </p>
          </div>
          
          <h6>Your Payment History</h6>
          {payments.length > 0 ? (
            <div className="list-group">
              {payments.map((payment) => (
                <div key={payment.id} className="list-group-item">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>${payment.amount}</strong>
                      <br />
                      <small className="text-muted">
                        Date: {new Date(payment.payment_date || payment.created_at).toLocaleDateString()}
                      </small>
                      <br />
                      <span className={`badge ${
                        payment.status === 'Paid' ? 'bg-success' : 
                        payment.status === 'Pending' ? 'bg-warning' : 'bg-danger'
                      }`}>
                        {payment.status}
                      </span>
                      {payment.plan_name && (
                        <>
                          <br />
                          <small className="text-info">Plan: {payment.plan_name}</small>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-4">
              <i className="fas fa-receipt fa-3x text-muted mb-3"></i>
              <p className="text-muted">No payment history found.</p>
              <small className="text-muted">Payments will appear here after you visit the gym.</small>
            </div>
          )}
        </div>
      </div>

      {/* Offcanvas for Feedback */}
      <div
        ref={feedbackCanvasRef}
        className={`offcanvas offcanvas-end ${showFeedbackCanvas ? 'show' : ''}`}
        style={{ visibility: showFeedbackCanvas ? 'visible' : 'hidden' }}
      >
        <div className="offcanvas-header" style={{
          background: 'linear-gradient(135deg, #38B6FF, #1E88E5)',
          color: '#F8F9FA'
        }}>
          <h5 style={{ fontWeight: '600' }}>Share Your Experience</h5>
          <button type="button" className="btn-close btn-close-white" onClick={toggleFeedbackCanvas}></button>
        </div>
        <div className="offcanvas-body">
          <form onSubmit={handleFeedbackSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Your Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-control"
                value={feedbackForm.name}
                onChange={handleFeedbackFormChange}
                required
                readOnly
                style={{ backgroundColor: '#f8f9fa' }}
              />
              <small className="text-muted">Your name is automatically filled from your profile</small>
            </div>
            
            <div className="mb-3">
              <label htmlFor="role" className="form-label">Your Role</label>
              <select
                id="role"
                name="role"
                className="form-select"
                value={feedbackForm.role}
                onChange={handleFeedbackFormChange}
                required
              >
                <option value="Member">Member</option>
                <option value="Regular Member">Regular Member</option>
                <option value="Premium Member">Premium Member</option>
                <option value="Fitness Enthusiast">Fitness Enthusiast</option>
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="rating" className="form-label">Your Rating</label>
              <div className="d-flex align-items-center gap-2">
                <select
                  id="rating"
                  name="rating"
                  className="form-select"
                  value={feedbackForm.rating}
                  onChange={handleFeedbackFormChange}
                  required
                  style={{ width: 'auto' }}
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5 stars)</option>
                  <option value={4}>⭐⭐⭐⭐ (4 stars)</option>
                  <option value={3}>⭐⭐⭐ (3 stars)</option>
                  <option value={2}>⭐⭐ (2 stars)</option>
                  <option value={1}>⭐ (1 star)</option>
                </select>
              </div>
            </div>
            
            <div className="mb-3">
              <label htmlFor="message" className="form-label">Your Testimonial</label>
              <textarea
                id="message"
                name="message"
                className="form-control"
                rows="4"
                placeholder="Share your experience with our gym, classes, facilities, or trainers. Your testimonial helps others discover our gym!"
                value={feedbackForm.message}
                onChange={handleFeedbackFormChange}
                required
              ></textarea>
            </div>
            
            {feedbackStatus && (
              <div className={`alert ${feedbackStatus.includes('successfully') ? 'alert-success' : 'alert-danger'} mb-3`}>
                <i className={`fas ${feedbackStatus.includes('successfully') ? 'fa-check-circle' : 'fa-exclamation-triangle'} me-2`}></i>
                {feedbackStatus}
              </div>
            )}
            
            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={toggleFeedbackCanvas}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn"
                disabled={!feedbackForm.message.trim()}
                style={{
                  background: 'linear-gradient(135deg, #38B6FF 0%, #1E88E5 100%)',
                  color: '#F8F9FA',
                  border: 'none',
                  borderRadius: '25px',
                  padding: '8px 20px',
                  fontWeight: 'bold',
                  boxShadow: '0 3px 10px rgba(56, 182, 255, 0.3)'
                }}
              >
                <i className="fas fa-star me-2"></i>
                Submit Testimonial
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Offcanvas for Coach Profile */}
      <div
        ref={coachProfileCanvasRef}
        className={`offcanvas offcanvas-end ${showCoachProfileCanvas ? 'show' : ''}`}
        style={{ visibility: showCoachProfileCanvas ? 'visible' : 'hidden' }}
      >
        <div className="offcanvas-header" style={{
          background: 'linear-gradient(135deg, #007BFF, #38B6FF)',
          color: '#F8F9FA'
        }}>
          <h5 style={{ fontWeight: '600' }}>{selectedCoach ? selectedCoach.name : 'Coach Profile'}</h5>
          <button type="button" className="btn-close btn-close-white" onClick={toggleCoachProfileCanvas}></button>
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

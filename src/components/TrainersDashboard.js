import React, { useState, useRef, useEffect } from 'react';
import Navbar from './Navbar'; // Ensure Navbar is correctly imported
import Footer from './Footer'; // Ensure Footer is correctly imported
import Chatbot from './Chatbot';
import './TrainersDashboard.css'; // Ensure correct path to your CSS
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const TrainersDashboard = () => {
  // State to manage the modal visibility for schedule, attendance, profile, and FAQ
  const [showModal, setShowModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showFaqModal, setShowFaqModal] = useState(false);
  const [userName, setUserName] = useState('');
  const [trainerId, setTrainerId] = useState(null);

  // Refs for offcanvas popups
  const scheduleRef = useRef();
  const attendanceRef = useRef();
  const profileRef = useRef();
  const faqRef = useRef();

  // Sample data for attendees (you can replace this with real data)
  const attendees = [
    { name: 'John Doe', status: 'Absent' },
    { name: 'Jane Smith', status: 'Present' },
    { name: 'Alice Johnson', status: 'Absent' },
    { name: 'Bob Brown', status: 'Present' },
  ];

  // Profile data from API
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    role: '',
  });
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState('');

  // FAQ state
  const [faqs, setFaqs] = useState([]);
  const [isFaqLoading, setIsFaqLoading] = useState(false);
  const [faqError, setFaqError] = useState('');
  const [faqSearchTerm, setFaqSearchTerm] = useState('');
  const [filteredFaqs, setFilteredFaqs] = useState([]);
  const [showAddFaqModal, setShowAddFaqModal] = useState(false);
  const [newFaqForm, setNewFaqForm] = useState({ question: '', answer: '' });
  const [addFaqError, setAddFaqError] = useState('');
  const [isAddingFaq, setIsAddingFaq] = useState(false);

  const [classes, setClasses] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dayClasses, setDayClasses] = useState([]);
  const [showAddClass, setShowAddClass] = useState(false);
  const [addClassForm, setAddClassForm] = useState({ name: '', class_time: '' });
  const [addClassError, setAddClassError] = useState('');
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);

  // Function to toggle the schedule modal visibility
  const toggleModal = () => {
    setShowModal(!showModal); // Toggle the modal visibility
  };

  // Function to toggle the attendance modal visibility
  const toggleAttendanceModal = () => {
    setShowAttendanceModal(!showAttendanceModal); // Toggle the modal visibility
  };

  // Function to toggle the profile modal visibility
  const toggleProfileModal = () => {
    setShowProfileModal(!showProfileModal); // Toggle the modal visibility
  };

  // Function to toggle the FAQ modal visibility
  const toggleFaqModal = () => {
    setShowFaqModal(!showFaqModal); // Toggle the modal visibility
    if (!showFaqModal) {
      setFaqSearchTerm(''); // Clear search when opening modal
    }
  };

  // Handle FAQ search
  const handleFaqSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setFaqSearchTerm(e.target.value);
    
    if (searchTerm === '') {
      setFilteredFaqs(faqs);
    } else {
      const filtered = faqs.filter(faq => 
        faq.question.toLowerCase().includes(searchTerm) || 
        faq.answer.toLowerCase().includes(searchTerm)
      );
      setFilteredFaqs(filtered);
    }
  };

  // Handle new FAQ form changes
  const handleNewFaqChange = (e) => {
    const { name, value } = e.target;
    setNewFaqForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle adding new FAQ
  const handleAddFaq = async (e) => {
    e.preventDefault();
    setIsAddingFaq(true);
    setAddFaqError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setAddFaqError('No authentication token found');
        return;
      }

      const response = await fetch('http://localhost:8000/api/faq', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: newFaqForm.question,
          answer: newFaqForm.answer,
        }),
      });

      if (response.ok) {
        const newFaq = await response.json();
        // Add the new FAQ to the lists
        setFaqs(prev => [...prev, newFaq]);
        setFilteredFaqs(prev => [...prev, newFaq]);
        // Reset form and close modal
        setNewFaqForm({ question: '', answer: '' });
        setShowAddFaqModal(false);
      } else {
        const errorData = await response.json();
        setAddFaqError(errorData.message || 'Failed to add FAQ');
      }
    } catch (error) {
      console.error('Error adding FAQ:', error);
      setAddFaqError('An error occurred while adding FAQ');
    } finally {
      setIsAddingFaq(false);
    }
  };

  // Handle profile data change (when user edits the profile)
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle the form submission (for saving the updated profile)
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsProfileLoading(true);
    setProfileError('');
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setProfileError('No authentication token found');
        return;
      }

      const response = await fetch(`http://localhost:8000/api/users/${trainerId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: profile.name,
          email: profile.email,
        }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        // Update the profile state with the response
        setProfile({
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
        });
        // Update the userName in the navbar
        setUserName(updatedUser.name);
        console.log('Profile updated successfully:', updatedUser);
        toggleProfileModal(); // Close the modal after saving
      } else {
        const errorData = await response.json();
        setProfileError(errorData.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setProfileError('An error occurred while updating profile');
    } finally {
      setIsProfileLoading(false);
    }
  };

  // Dismiss offcanvas by clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (showModal && scheduleRef.current && !scheduleRef.current.contains(event.target)) {
        setShowModal(false);
      }
      if (showAttendanceModal && attendanceRef.current && !attendanceRef.current.contains(event.target)) {
        setShowAttendanceModal(false);
      }
      if (showProfileModal && profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileModal(false);
      }
      if (showFaqModal && faqRef.current && !faqRef.current.contains(event.target)) {
        setShowFaqModal(false);
      }
    }
    if (showModal || showAttendanceModal || showProfileModal || showFaqModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showModal, showAttendanceModal, showProfileModal, showFaqModal]);

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
          setTrainerId(data.id); // Save trainer ID
          // Set profile data from the current user
          setProfile({
            name: data.name,
            email: data.email,
            role: data.role,
          });
        }
      } catch (error) {}
    };
    fetchUserName();
  }, []);

  useEffect(() => {
    if (showModal) {
      const fetchClasses = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch('http://localhost:8000/api/classes', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          if (response.ok) {
            const data = await response.json();
            setClasses(data);
          }
        } catch (error) {}
      };
      fetchClasses();
    }
  }, [showModal]);

  // Fetch FAQs when FAQ modal is opened
  useEffect(() => {
    if (showFaqModal) {
      const fetchFaqs = async () => {
        setIsFaqLoading(true);
        setFaqError('');
        try {
          const token = localStorage.getItem('token');
          const response = await fetch('http://localhost:8000/api/faq', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          if (response.ok) {
            const data = await response.json();
            setFaqs(data);
            setFilteredFaqs(data); // Initialize filtered FAQs with all FAQs
          } else {
            setFaqError('Failed to fetch FAQs');
          }
        } catch (error) {
          setFaqError('An error occurred while fetching FAQs');
        } finally {
          setIsFaqLoading(false);
        }
      };
      fetchFaqs();
    }
  }, [showFaqModal]);

  const handleDayClick = (date) => {
    setSelectedDate(date);
    const dayStr = date.getFullYear() + '-' +
      String(date.getMonth() + 1).padStart(2, '0') + '-' +
      String(date.getDate()).padStart(2, '0');
    const filtered = classes.filter(c => c.class_date === dayStr);
    setDayClasses(filtered);
  };

  return (
    <div className="trainers-dashboard">
      {/* Navbar */}
      <Navbar userName={userName} />

      {/* Header Section */}
      <header id="header">
        <video src="img/video.mp4" autoPlay loop muted></video>
        <div className="overlay"></div>
        <div className="container py-5">
          <h1 className="text-white" style={{ fontSize: '5rem' }} data-aos="fade-right" data-aos-duration="2000">
            Trainers Dashboard
          </h1>
          <h3 className="text-white" style={{ fontSize: '2rem' }} data-aos="fade-left" data-aos-duration="2000">
            Manage your classes, attendance, and profile with ease
          </h3>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="dashboard-container container py-5">
        <div className="row">
          {/* Manage Classes Section */}
          <div className="col-md-4">
            <div className="card section-card" data-aos="fade-up" data-aos-duration="1000" style={{
              background: 'linear-gradient(135deg, #F8F9FA 0%, #E3F2FD 100%)',
              border: '2px solid #38B6FF',
              borderRadius: '15px',
              boxShadow: '0 8px 25px rgba(56, 182, 255, 0.15)'
            }}>
              <h2 className="card-title" style={{ color: '#007BFF', fontWeight: 'bold' }}>Manage Classes</h2>
              <p style={{ color: '#4A4A4A' }}>Schedule and manage your fitness classes effectively.</p>
              <button 
                className="btn"
                onClick={toggleModal}
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
                Go to Classes
              </button>
            </div>

            {/* Offcanvas modal to show class schedule */}
            {showModal && (
              <div
                ref={scheduleRef}
                className="offcanvas offcanvas-end show"
                tabIndex="-1"
                id="scheduleModal"
                aria-labelledby="offcanvasLabel"
                style={{ backgroundColor: '#F8F9FA' }}
              >
                <div className="offcanvas-header" style={{ backgroundColor: '#007BFF', borderBottom: '2px solid #38B6FF' }}>
                  <h5 className="offcanvas-title" id="offcanvasLabel" style={{ color: '#F8F9FA', fontWeight: 'bold' }}>Class Calendar</h5>
                  <button type="button" className="btn-close" onClick={toggleModal} aria-label="Close" style={{ filter: 'invert(1)' }}></button>
                </div>
                <div className="offcanvas-body" style={{ backgroundColor: '#F8F9FA', color: '#4A4A4A' }}>
                  <Calendar
                    onClickDay={handleDayClick}
                    tileContent={({ date, view }) => {
                      if (view === 'month') {
                        const dayStr = date.getFullYear() + '-' +
                          String(date.getMonth() + 1).padStart(2, '0') + '-' +
                          String(date.getDate()).padStart(2, '0');
                        const hasClass = classes.some(c => c.class_date === dayStr);
                        return hasClass ? <span style={{ color: '#2ECC71', fontWeight: 'bold' }}>•</span> : null;
                      }
                    }}
                  />
                  {selectedDate && (
                    <div className="mt-4">
                      <h6 style={{ color: '#007BFF', fontWeight: 'bold' }}>Classes on {selectedDate.getFullYear()}-{String(selectedDate.getMonth() + 1).padStart(2, '0')}-{String(selectedDate.getDate()).padStart(2, '0')}</h6>
                      <button 
                        className="btn mb-3"
                        onClick={() => setShowAddClassModal(true)}
                        style={{
                          background: 'linear-gradient(135deg, #2ECC71 0%, #27AE60 100%)',
                          color: '#F8F9FA',
                          border: 'none',
                          borderRadius: '20px',
                          padding: '10px 20px',
                          fontWeight: 'bold',
                          boxShadow: '0 4px 12px rgba(46, 204, 113, 0.3)'
                        }}
                      >
                        Add Class
                      </button>
                      {showAddClassModal && (
                        <div className="modal show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.2)' }}>
                          <div className="modal-dialog">
                            <div className="modal-content" style={{ backgroundColor: '#F8F9FA', border: '2px solid #38B6FF', borderRadius: '15px' }}>
                              <div className="modal-header" style={{ backgroundColor: '#007BFF', borderBottom: '2px solid #38B6FF' }}>
                                <h5 className="modal-title" style={{ color: '#F8F9FA', fontWeight: 'bold' }}>Add Class</h5>
                                <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowAddClassModal(false)} style={{ filter: 'invert(1)' }}></button>
                              </div>
                              <form onSubmit={async (e) => {
                                e.preventDefault();
                                setAddClassError('');
                                // Check for 1 hour gap
                                const newTime = addClassForm.class_time;
                                const newHour = parseInt(newTime.split(':')[0], 10);
                                const conflict = dayClasses.some(c => {
                                  const t = (c.class_time || c.classe_time || '').split(':')[0];
                                  return Math.abs(parseInt(t, 10) - newHour) < 1;
                                });
                                if (conflict) {
                                  setAddClassError('Class times must be at least one hour apart.');
                                  return;
                                }
                                const token = localStorage.getItem('token');
                                const dateStr = selectedDate.getFullYear() + '-' + String(selectedDate.getMonth() + 1).padStart(2, '0') + '-' + String(selectedDate.getDate()).padStart(2, '0');
                                const res = await fetch('http://localhost:8000/api/classes', {
                                  method: 'POST',
                                  headers: {
                                    'Authorization': `Bearer ${token}`,
                                    'Content-Type': 'application/json',
                                  },
                                  body: JSON.stringify({
                                    name: addClassForm.name,
                                    class_time: addClassForm.class_time.length === 5 ? addClassForm.class_time + ':00' : addClassForm.class_time,
                                    class_date: dateStr,
                                    trainer_id: trainerId,
                                  }),
                                });
                                if (res.ok) {
                                  setShowAddClassModal(false);
                                  setAddClassForm({ name: '', class_time: '' });
                                  // Refresh classes for the day
                                  const updated = await res.json();
                                  setClasses(prev => [...prev, updated]);
                                  setDayClasses(prev => [...prev, updated]);
                                } else {
                                  setAddClassError('Failed to add class.');
                                }
                              }}>
                                <div className="modal-body" style={{ backgroundColor: '#F8F9FA', color: '#4A4A4A' }}>
                                  <div className="mb-3">
                                    <label className="form-label" style={{ color: '#343A40', fontWeight: 'bold' }}>Class Name</label>
                                    <input 
                                      type="text" 
                                      className="form-control" 
                                      value={addClassForm.name} 
                                      onChange={e => setAddClassForm(f => ({ ...f, name: e.target.value }))} 
                                      required 
                                      style={{
                                        border: '2px solid #38B6FF',
                                        borderRadius: '10px',
                                        backgroundColor: '#FFFFFF',
                                        color: '#343A40',
                                        padding: '12px 15px'
                                      }}
                                    />
                                  </div>
                                  <div className="mb-3">
                                    <label className="form-label" style={{ color: '#343A40', fontWeight: 'bold' }}>Time</label>
                                    <input 
                                      type="time" 
                                      className="form-control" 
                                      value={addClassForm.class_time} 
                                      onChange={e => setAddClassForm(f => ({ ...f, class_time: e.target.value }))} 
                                      required 
                                      style={{
                                        border: '2px solid #38B6FF',
                                        borderRadius: '10px',
                                        backgroundColor: '#FFFFFF',
                                        color: '#343A40',
                                        padding: '12px 15px'
                                      }}
                                    />
                                  </div>
                                  {addClassError && <div className="alert alert-danger" style={{ backgroundColor: '#FFE6E6', border: '1px solid #FF6B6B', color: '#FF6B6B' }}>{addClassError}</div>}
                                </div>
                                <div className="modal-footer" style={{ backgroundColor: '#F8F9FA', borderTop: '2px solid #38B6FF' }}>
                                  <button 
                                    type="button" 
                                    className="btn" 
                                    onClick={() => setShowAddClassModal(false)}
                                    style={{
                                      backgroundColor: '#6C757D',
                                      color: '#F8F9FA',
                                      border: 'none',
                                      borderRadius: '20px',
                                      padding: '10px 20px'
                                    }}
                                  >
                                    Cancel
                                  </button>
                                  <button 
                                    type="submit" 
                                    className="btn"
                                    style={{
                                      background: 'linear-gradient(135deg, #2ECC71 0%, #27AE60 100%)',
                                      color: '#F8F9FA',
                                      border: 'none',
                                      borderRadius: '20px',
                                      padding: '10px 20px',
                                      fontWeight: 'bold'
                                    }}
                                  >
                                    Confirm
                                  </button>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                      )}
                      {dayClasses.length === 0 ? (
                        <div style={{ color: '#4A4A4A', padding: '20px', textAlign: 'center', backgroundColor: '#FFFFFF', borderRadius: '10px', border: '1px solid #E0E0E0' }}>No classes scheduled for this day.</div>
                      ) : (
                        <table className="table table-striped" style={{ backgroundColor: '#FFFFFF', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                          <thead>
                            <tr style={{ backgroundColor: '#007BFF' }}>
                              <th style={{ color: '#F8F9FA', fontWeight: 'bold' }}>Class Name</th>
                              <th style={{ color: '#F8F9FA', fontWeight: 'bold' }}>Trainer</th>
                              <th style={{ color: '#F8F9FA', fontWeight: 'bold' }}>Time</th>
                              <th style={{ color: '#F8F9FA', fontWeight: 'bold' }}>Participants</th>
                            </tr>
                          </thead>
                          <tbody>
                            {dayClasses.map((c) => (
                              <tr key={c.id} style={{ backgroundColor: '#F8F9FA' }}>
                                <td style={{ color: '#4A4A4A' }}>{c.name}</td>
                                <td style={{ color: '#4A4A4A' }}>{c.trainer ? c.trainer.name : 'N/A'}</td>
                                <td style={{ color: '#4A4A4A' }}>{c.class_time || c.classe_time}</td>
                                <td style={{ color: '#4A4A4A' }}>{c.participants_count}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          

          {/* Profile Section - Added Edit Profile Button */}
          <div className="col-md-4">
            <div className="card section-card" data-aos="fade-up" data-aos-duration="2000" style={{
              background: 'linear-gradient(135deg, #F8F9FA 0%, #E8F5E8 100%)',
              border: '2px solid #2ECC71',
              borderRadius: '15px',
              boxShadow: '0 8px 25px rgba(46, 204, 113, 0.15)'
            }}>
              <h2 className="card-title" style={{ color: '#007BFF', fontWeight: 'bold' }}>Profile</h2>
              <p style={{ color: '#4A4A4A' }}>Update your personal information and account settings.</p>
              <button 
                className="btn"
                onClick={toggleProfileModal}
                style={{
                  background: 'linear-gradient(135deg, #38B6FF 0%, #1E88E5 100%)',
                  color: '#F8F9FA',
                  border: 'none',
                  borderRadius: '25px',
                  padding: '12px 24px',
                  fontWeight: 'bold',
                  boxShadow: '0 5px 15px rgba(56, 182, 255, 0.3)'
                }}
              >
                Edit Profile
              </button>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="col-md-4">
            <div className="card section-card" data-aos="fade-up" data-aos-duration="2500" style={{
              background: 'linear-gradient(135deg, #F8F9FA 0%, #FFF3E0 100%)',
              border: '2px solid #38B6FF',
              borderRadius: '15px',
              boxShadow: '0 8px 25px rgba(56, 182, 255, 0.15)'
            }}>
              <h2 className="card-title" style={{ color: '#007BFF', fontWeight: 'bold' }}>FAQ</h2>
              <p style={{ color: '#4A4A4A' }}>View frequently asked questions and answers.</p>
              <button 
                className="btn"
                onClick={toggleFaqModal}
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
                View FAQ
              </button>
            </div>
          </div>
        </div>
      </div>

      

      {/* Profile Modal */}
      {showProfileModal && (
        <div
          ref={profileRef}
          className="offcanvas offcanvas-end show"
          tabIndex="-1"
          id="profileModal"
          aria-labelledby="offcanvasLabel"
          style={{ backgroundColor: '#F8F9FA' }}
        >
          <div className="offcanvas-header" style={{ backgroundColor: '#2ECC71', borderBottom: '2px solid #38B6FF' }}>
            <h5 className="offcanvas-title" id="offcanvasLabel" style={{ color: '#F8F9FA', fontWeight: 'bold' }}>Edit Profile</h5>
            <button type="button" className="btn-close" onClick={toggleProfileModal} aria-label="Close" style={{ filter: 'invert(1)' }}></button>
          </div>
          <div className="offcanvas-body" style={{ backgroundColor: '#F8F9FA', color: '#4A4A4A' }}>
            <form onSubmit={handleProfileSubmit}>
              {profileError && (
                <div className="alert alert-danger" role="alert" style={{ backgroundColor: '#FFE6E6', border: '1px solid #FF6B6B', color: '#FF6B6B' }}>
                  {profileError}
                </div>
              )}
              <div className="mb-3">
                <label htmlFor="name" className="form-label" style={{ color: '#343A40', fontWeight: 'bold' }}>Name</label>
                <input
                  type="text"
                  id="name"
                  className="form-control"
                  name="name"
                  value={profile.name}
                  onChange={handleProfileChange}
                  required
                  style={{
                    border: '2px solid #2ECC71',
                    borderRadius: '10px',
                    backgroundColor: '#FFFFFF',
                    color: '#343A40',
                    padding: '12px 15px'
                  }}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label" style={{ color: '#343A40', fontWeight: 'bold' }}>Email</label>
                <input
                  type="email"
                  id="email"
                  className="form-control"
                  name="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                  required
                  style={{
                    border: '2px solid #2ECC71',
                    borderRadius: '10px',
                    backgroundColor: '#FFFFFF',
                    color: '#343A40',
                    padding: '12px 15px'
                  }}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="role" className="form-label" style={{ color: '#343A40', fontWeight: 'bold' }}>Role</label>
                <input
                  type="text"
                  id="role"
                  className="form-control"
                  name="role"
                  value={profile.role}
                  readOnly
                  disabled
                  style={{
                    border: '2px solid #E0E0E0',
                    borderRadius: '10px',
                    backgroundColor: '#F0F0F0',
                    color: '#6C757D',
                    padding: '12px 15px'
                  }}
                />
              </div>
              <button 
                type="submit" 
                className="btn"
                disabled={isProfileLoading}
                style={{
                  background: 'linear-gradient(135deg, #38B6FF 0%, #1E88E5 100%)',
                  color: '#F8F9FA',
                  border: 'none',
                  borderRadius: '25px',
                  padding: '12px 24px',
                  fontWeight: 'bold',
                  boxShadow: '0 5px 15px rgba(56, 182, 255, 0.3)'
                }}
              >
                {isProfileLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* FAQ Modal */}
      {showFaqModal && (
        <div
          ref={faqRef}
          className="offcanvas offcanvas-end show"
          tabIndex="-1"
          id="faqModal"
          aria-labelledby="offcanvasLabel"
          style={{ backgroundColor: '#F8F9FA' }}
        >
          <div className="offcanvas-header" style={{ backgroundColor: '#38B6FF', borderBottom: '2px solid #007BFF' }}>
            <h5 className="offcanvas-title" id="offcanvasLabel" style={{ color: '#F8F9FA', fontWeight: 'bold' }}>Frequently Asked Questions</h5>
            <button type="button" className="btn-close" onClick={toggleFaqModal} aria-label="Close" style={{ filter: 'invert(1)' }}></button>
          </div>
          <div className="offcanvas-body" style={{ backgroundColor: '#F8F9FA', color: '#4A4A4A' }}>
            {/* Search Bar */}
            <div className="mb-3">
              <div className="input-group">
                <span className="input-group-text" style={{ backgroundColor: '#38B6FF', color: '#F8F9FA', border: '2px solid #38B6FF' }}>
                  <i className="fas fa-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search FAQs..."
                  value={faqSearchTerm}
                  onChange={handleFaqSearch}
                  style={{
                    border: '2px solid #38B6FF',
                    borderLeft: 'none',
                    backgroundColor: '#FFFFFF',
                    color: '#343A40',
                    padding: '12px 15px'
                  }}
                />
              </div>
            </div>

            {isFaqLoading && (
              <div className="d-flex justify-content-center">
                <div className="spinner-border" role="status" style={{ color: '#38B6FF' }}>
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}
            
            {faqError && (
              <div className="alert alert-danger" role="alert" style={{ backgroundColor: '#FFE6E6', border: '1px solid #FF6B6B', color: '#FF6B6B' }}>
                {faqError}
              </div>
            )}

            {!isFaqLoading && !faqError && faqs.length === 0 && (
              <div className="alert alert-info" role="alert" style={{ backgroundColor: '#E3F2FD', border: '1px solid #38B6FF', color: '#007BFF' }}>
                No FAQs available at the moment.
              </div>
            )}

            {!isFaqLoading && !faqError && faqs.length > 0 && filteredFaqs.length === 0 && faqSearchTerm && (
              <div className="alert alert-warning" role="alert" style={{ backgroundColor: '#FFF3E0', border: '1px solid #FFC107', color: '#FF8F00' }}>
                No FAQs found matching your search term "{faqSearchTerm}".
              </div>
            )}

            {!isFaqLoading && filteredFaqs.length > 0 && (
              <div className="accordion" id="faqAccordion">
                {filteredFaqs.map((faq, index) => (
                  <div className="accordion-item" key={faq.id} style={{ border: '1px solid #38B6FF', borderRadius: '10px', marginBottom: '10px', overflow: 'hidden' }}>
                    <h2 className="accordion-header" id={`heading${index}`}>
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#collapse${index}`}
                        aria-expanded="false"
                        aria-controls={`collapse${index}`}
                        style={{
                          backgroundColor: '#007BFF',
                          color: '#F8F9FA',
                          fontWeight: 'bold',
                          border: 'none'
                        }}
                      >
                        {faq.question}
                      </button>
                    </h2>
                    <div
                      id={`collapse${index}`}
                      className="accordion-collapse collapse"
                      aria-labelledby={`heading${index}`}
                      data-bs-parent="#faqAccordion"
                    >
                      <div className="accordion-body" style={{ backgroundColor: '#F8F9FA', color: '#4A4A4A', padding: '20px' }}>
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add FAQ Modal */}
          {showAddFaqModal && (
            <div className="modal show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
              <div className="modal-dialog">
                <div className="modal-content" style={{ backgroundColor: '#F8F9FA', border: '2px solid #38B6FF', borderRadius: '15px' }}>
                  <div className="modal-header" style={{ backgroundColor: '#38B6FF', borderBottom: '2px solid #007BFF' }}>
                    <h5 className="modal-title" style={{ color: '#F8F9FA', fontWeight: 'bold' }}>Add New FAQ</h5>
                    <button 
                      type="button" 
                      className="btn-close" 
                      aria-label="Close" 
                      onClick={() => {
                        setShowAddFaqModal(false);
                        setNewFaqForm({ question: '', answer: '' });
                        setAddFaqError('');
                      }}
                      style={{ filter: 'invert(1)' }}
                    ></button>
                  </div>
                  <form onSubmit={handleAddFaq}>
                    <div className="modal-body" style={{ backgroundColor: '#F8F9FA', color: '#4A4A4A' }}>
                      {addFaqError && (
                        <div className="alert alert-danger" role="alert" style={{ backgroundColor: '#FFE6E6', border: '1px solid #FF6B6B', color: '#FF6B6B' }}>
                          {addFaqError}
                        </div>
                      )}
                      <div className="mb-3">
                        <label htmlFor="question" className="form-label" style={{ color: '#343A40', fontWeight: 'bold' }}>Question</label>
                        <input
                          type="text"
                          id="question"
                          className="form-control"
                          name="question"
                          value={newFaqForm.question}
                          onChange={handleNewFaqChange}
                          placeholder="Enter your question..."
                          required
                          style={{
                            border: '2px solid #38B6FF',
                            borderRadius: '10px',
                            backgroundColor: '#FFFFFF',
                            color: '#343A40',
                            padding: '12px 15px'
                          }}
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="answer" className="form-label" style={{ color: '#343A40', fontWeight: 'bold' }}>Answer</label>
                        <textarea
                          id="answer"
                          className="form-control"
                          name="answer"
                          rows="4"
                          value={newFaqForm.answer}
                          onChange={handleNewFaqChange}
                          placeholder="Enter the answer..."
                          required
                          style={{
                            border: '2px solid #38B6FF',
                            borderRadius: '10px',
                            backgroundColor: '#FFFFFF',
                            color: '#343A40',
                            padding: '12px 15px'
                          }}
                        ></textarea>
                      </div>
                    </div>
                    <div className="modal-footer" style={{ backgroundColor: '#F8F9FA', borderTop: '2px solid #38B6FF' }}>
                      <button 
                        type="button" 
                        className="btn" 
                        onClick={() => {
                          setShowAddFaqModal(false);
                          setNewFaqForm({ question: '', answer: '' });
                          setAddFaqError('');
                        }}
                        style={{
                          backgroundColor: '#6C757D',
                          color: '#F8F9FA',
                          border: 'none',
                          borderRadius: '20px',
                          padding: '10px 20px'
                        }}
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        className="btn"
                        disabled={isAddingFaq}
                        style={{
                          background: 'linear-gradient(135deg, #2ECC71 0%, #27AE60 100%)',
                          color: '#F8F9FA',
                          border: 'none',
                          borderRadius: '20px',
                          padding: '10px 20px',
                          fontWeight: 'bold'
                        }}
                      >
                        {isAddingFaq ? 'Adding...' : 'Add FAQ'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer Section */}
      <Footer />

      {/* Floating Chatbot Button */}
      {!showChatbot && (
        <button
          onClick={() => setShowChatbot(true)}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '60px',
            height: '60px',
            backgroundColor: '#007BFF',
            border: 'none',
            borderRadius: '50%',
            color: '#FFFFFF',
            fontSize: '24px',
            cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(0, 123, 255, 0.4)',
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'scale(1.1)';
            e.target.style.backgroundColor = '#0056B3';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.backgroundColor = '#007BFF';
          }}
          title="Chat with Gym Assistant"
        >
          💬
        </button>
      )}

      {/* Chatbot Component */}
      {showChatbot && (
        <Chatbot onClose={() => setShowChatbot(false)} />
      )}
    </div>
  );
};

export default TrainersDashboard;

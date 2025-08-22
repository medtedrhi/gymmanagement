import React, { useState, useRef, useEffect } from 'react';
import Navbar from './Navbar'; // Ensure Navbar is correctly imported
import Footer from './Footer'; // Ensure Footer is correctly imported
import './TrainersDashboard.css'; // Ensure correct path to your CSS
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const TrainersDashboard = () => {
  // State to manage the modal visibility for schedule, attendance, and profile
  const [showModal, setShowModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [userName, setUserName] = useState('');
  const [trainerId, setTrainerId] = useState(null);

  // Refs for offcanvas popups
  const scheduleRef = useRef();
  const attendanceRef = useRef();
  const profileRef = useRef();

  // Sample data for attendees (you can replace this with real data)
  const attendees = [
    { name: 'John Doe', status: 'Absent' },
    { name: 'Jane Smith', status: 'Present' },
    { name: 'Alice Johnson', status: 'Absent' },
    { name: 'Bob Brown', status: 'Present' },
  ];

  // Sample profile data (this can be fetched from an API in real-world use)
  const [profile, setProfile] = useState({
    name: 'John Coach',
    email: 'john.coach@example.com',
    bio: 'Experienced fitness coach with 5 years of teaching various fitness programs.',
  });

  const [classes, setClasses] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dayClasses, setDayClasses] = useState([]);
  const [showAddClass, setShowAddClass] = useState(false);
  const [addClassForm, setAddClassForm] = useState({ name: '', class_time: '', participants_count: 0 });
  const [addClassError, setAddClassError] = useState('');
  const [showAddClassModal, setShowAddClassModal] = useState(false);

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

  // Handle profile data change (when user edits the profile)
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle the form submission (for saving the updated profile)
  const handleProfileSubmit = (e) => {
    e.preventDefault();
    console.log('Updated Profile:', profile);
    // Here you can add functionality to save the updated profile to your backend or API
    toggleProfileModal(); // Close the modal after saving
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
    }
    if (showModal || showAttendanceModal || showProfileModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showModal, showAttendanceModal, showProfileModal]);

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
            <div className="card section-card" data-aos="fade-up" data-aos-duration="1000">
              <h2 className="card-title">Manage Classes</h2>
              <p>Schedule and manage your fitness classes effectively.</p>
              <button className="btn btn-primary" onClick={toggleModal}>
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
              >
                <div className="offcanvas-header">
                  <h5 className="offcanvas-title" id="offcanvasLabel">Class Calendar</h5>
                  <button type="button" className="btn-close" onClick={toggleModal} aria-label="Close"></button>
                </div>
                <div className="offcanvas-body">
                  <Calendar
                    onClickDay={handleDayClick}
                    tileContent={({ date, view }) => {
                      if (view === 'month') {
                        const dayStr = date.getFullYear() + '-' +
                          String(date.getMonth() + 1).padStart(2, '0') + '-' +
                          String(date.getDate()).padStart(2, '0');
                        const hasClass = classes.some(c => c.class_date === dayStr);
                        return hasClass ? <span style={{ color: 'red', fontWeight: 'bold' }}>•</span> : null;
                      }
                    }}
                  />
                  {selectedDate && (
                    <div className="mt-4">
                      <h6>Classes on {selectedDate.getFullYear()}-{String(selectedDate.getMonth() + 1).padStart(2, '0')}-{String(selectedDate.getDate()).padStart(2, '0')}</h6>
                      <button className="btn btn-success mb-3" onClick={() => setShowAddClassModal(true)}>
                        Add Class
                      </button>
                      {showAddClassModal && (
                        <div className="modal show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.2)' }}>
                          <div className="modal-dialog">
                            <div className="modal-content">
                              <div className="modal-header">
                                <h5 className="modal-title">Add Class</h5>
                                <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowAddClassModal(false)}></button>
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
                                    participants_count: addClassForm.participants_count,
                                    trainer_id: trainerId,
                                  }),
                                });
                                if (res.ok) {
                                  setShowAddClassModal(false);
                                  setAddClassForm({ name: '', class_time: '', participants_count: 0 });
                                  // Refresh classes for the day
                                  const updated = await res.json();
                                  setClasses(prev => [...prev, updated]);
                                  setDayClasses(prev => [...prev, updated]);
                                } else {
                                  setAddClassError('Failed to add class.');
                                }
                              }}>
                                <div className="modal-body">
                                  <div className="mb-3">
                                    <label className="form-label">Class Name</label>
                                    <input type="text" className="form-control" value={addClassForm.name} onChange={e => setAddClassForm(f => ({ ...f, name: e.target.value }))} required />
                                  </div>
                                  <div className="mb-3">
                                    <label className="form-label">Time</label>
                                    <input type="time" className="form-control" value={addClassForm.class_time} onChange={e => setAddClassForm(f => ({ ...f, class_time: e.target.value }))} required />
                                  </div>
                                  <div className="mb-3">
                                    <label className="form-label">Participants</label>
                                    <input type="number" className="form-control" value={addClassForm.participants_count} min="0" onChange={e => setAddClassForm(f => ({ ...f, participants_count: e.target.value }))} required />
                                  </div>
                                  {addClassError && <div className="alert alert-danger">{addClassError}</div>}
                                </div>
                                <div className="modal-footer">
                                  <button type="button" className="btn btn-secondary" onClick={() => setShowAddClassModal(false)}>Cancel</button>
                                  <button type="submit" className="btn btn-success">Confirm</button>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                      )}
                      {dayClasses.length === 0 ? (
                        <div>No classes scheduled for this day.</div>
                      ) : (
                        <table className="table table-striped">
                          <thead>
                            <tr>
                              <th>Class Name</th>
                              <th>Trainer</th>
                              <th>Time</th>
                              <th>Participants</th>
                            </tr>
                          </thead>
                          <tbody>
                            {dayClasses.map((c) => (
                              <tr key={c.id}>
                                <td>{c.name}</td>
                                <td>{c.trainer ? c.trainer.name : 'N/A'}</td>
                                <td>{c.class_time || c.classe_time}</td>
                                <td>{c.participants_count}</td>
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
            <div className="card section-card" data-aos="fade-up" data-aos-duration="2000">
              <h2 className="card-title">Profile</h2>
              <p>Update your personal information and account settings.</p>
              <button className="btn btn-primary" onClick={toggleProfileModal}>
                Edit Profile
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
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="offcanvasLabel">Edit Profile</h5>
            <button type="button" className="btn-close" onClick={toggleProfileModal} aria-label="Close"></button>
          </div>
          <div className="offcanvas-body">
            <form onSubmit={handleProfileSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Name</label>
                <input
                  type="text"
                  id="name"
                  className="form-control"
                  name="name"
                  value={profile.name}
                  onChange={handleProfileChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  id="email"
                  className="form-control"
                  name="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="bio" className="form-label">Bio</label>
                <textarea
                  id="bio"
                  className="form-control"
                  name="bio"
                  value={profile.bio}
                  onChange={handleProfileChange}
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary">Save Changes</button>
            </form>
          </div>
        </div>
      )}

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default TrainersDashboard;

import React, { useState, useEffect, useRef } from 'react';
import Navbar from './Navbar'; // Ensure Navbar is correctly imported
import Footer from './Footer'; // Ensure Footer is correctly imported
import './AdminsDashboard.css'; // Ensure correct path to your CSS

const AdminsDashboard = () => {
  // State to manage modal visibility
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [showClassesModal, setShowClassesModal] = useState(false);
  const [showPaymentsModal, setShowPaymentsModal] = useState(false);
  const [showReportsModal, setShowReportsModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', role: '' });
  const [successMessage, setSuccessMessage] = useState('');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [addUserForm, setAddUserForm] = useState({ name: '', email: '', role: 'member', password: '' });
  const [userName, setUserName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Sample data for users and classes
  const [users, setUsers] = useState([]);

  const [classes, setClasses] = useState([]);

  const offcanvasRef = useRef();
  const modalRef = useRef();
  const classesOffcanvasRef = useRef();
  const paymentsOffcanvasRef = useRef();
  const reportsOffcanvasRef = useRef();
  const addUserModalRef = useRef();
  const editClassModalRef = useRef();
  const addClassModalRef = useRef();

  // Toggle modals
  const toggleUsersModal = () => setShowUsersModal(!showUsersModal);
  const toggleClassesModal = () => setShowClassesModal(!showClassesModal);
  const togglePaymentsModal = () => setShowPaymentsModal(!showPaymentsModal);
  const toggleReportsModal = () => setShowReportsModal(!showReportsModal);

  // Handle delete for users and classes
  const handleDeleteUser = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        setUsers(users.filter((user) => user.id !== id));
        setSuccessMessage('User deleted successfully!');
        setTimeout(() => setSuccessMessage(''), 2000);
      } else {
        // Optionally handle error
      }
    } catch (error) {
      // Optionally handle error
    }
  };

  const handleDeleteClass = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/classes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        setClasses(classes.filter((classItem) => classItem.id !== id));
        setSuccessMessage('Class deleted successfully!');
        setTimeout(() => setSuccessMessage(''), 2000);
      } else {
        setSuccessMessage('Failed to delete class.');
        setTimeout(() => setSuccessMessage(''), 2000);
      }
    } catch (error) {
      setSuccessMessage('Error deleting class.');
      setTimeout(() => setSuccessMessage(''), 2000);
    }
  };

  const handleEditClick = (user) => {
    setEditUser(user);
    setEditForm({ name: user.name, email: user.email, role: user.role });
  };
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/users/${editUser.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });
      if (response.ok) {
        const updated = await response.json();
        setUsers(users.map(u => u.id === updated.id ? updated : u));
        setEditUser(null);
        setSuccessMessage('User updated successfully!');
        setTimeout(() => setSuccessMessage(''), 2000);
      } else {
        // Optionally handle error
      }
    } catch (error) {
      // Optionally handle error
    }
  };
  const handleEditCancel = () => setEditUser(null);

  const handleAddUserFormChange = (e) => {
    const { name, value } = e.target;
    setAddUserForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleAddUserSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addUserForm),
      });
      if (response.ok) {
        setShowAddUserModal(false);
        setAddUserForm({ name: '', email: '', role: 'member', password: '' });
        setSuccessMessage('User added successfully!');
        // Refresh users
        const usersRes = await fetch('http://localhost:8000/api/users', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (usersRes.ok) {
          const data = await usersRes.json();
          setUsers(data);
        }
        setTimeout(() => setSuccessMessage(''), 2000);
      } else {
        setSuccessMessage('Failed to add user.');
        setTimeout(() => setSuccessMessage(''), 2000);
      }
    } catch (error) {
      setSuccessMessage('Error adding user.');
      setTimeout(() => setSuccessMessage(''), 2000);
    }
  };

  const [editClass, setEditClass] = useState(null);
  const [editClassForm, setEditClassForm] = useState({ name: '', class_time: '', class_date: '', trainer_id: '', participants_count: 0 });

  const handleEditClassClick = (classItem) => {
    setEditClass(classItem);
    setEditClassForm({
      name: classItem.name || '',
      class_time: classItem.class_time || '',
      class_date: classItem.class_date || '',
      trainer_id: classItem.trainer_id || '',
      participants_count: classItem.participants_count || 0,
    });
  };
  const handleEditClassFormChange = (e) => {
    const { name, value } = e.target;
    setEditClassForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleEditClassSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/classes/${editClass.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editClassForm),
      });
      if (response.ok) {
        const updated = await response.json();
        setClasses(classes.map(c => c.id === updated.id ? updated : c));
        setEditClass(null);
        setSuccessMessage('Class updated successfully!');
        setTimeout(() => setSuccessMessage(''), 2000);
      } else {
        setSuccessMessage('Failed to update class.');
        setTimeout(() => setSuccessMessage(''), 2000);
      }
    } catch (error) {
      setSuccessMessage('Error updating class.');
      setTimeout(() => setSuccessMessage(''), 2000);
    }
  };
  const handleEditClassCancel = () => setEditClass(null);

  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [addClassForm, setAddClassForm] = useState({ name: '', class_time: '', class_date: '', trainer_id: '', participants_count: 0 });

  const handleAddClassFormChange = (e) => {
    const { name, value } = e.target;
    // For class_time, ensure value is in HH:mm:ss
    if (name === 'class_time') {
      let formatted = value;
      if (value.length === 5) formatted = value + ':00';
      setAddClassForm((prev) => ({ ...prev, [name]: formatted }));
    } else {
      setAddClassForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddPaymentFormChange = (e) => {
    const { name, value } = e.target;
    setAddPaymentForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddPaymentSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/payments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addPaymentForm),
      });
      if (response.ok) {
        setShowAddPaymentModal(false);
        setAddPaymentForm({ user_id: '', plan_id: '', amount: '', payment_date: new Date().toISOString().split('T')[0], status: 'Pending' });
        setSuccessMessage('Payment added successfully!');
        // Refresh payments
        const paymentsRes = await fetch('http://localhost:8000/api/payments', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (paymentsRes.ok) {
          const data = await paymentsRes.json();
          const transformedPayments = await Promise.all(data.map(async payment => {
            let planName = 'Unknown Plan';
            try {
              const planResponse = await fetch(`http://localhost:8000/api/plans/${payment.plan_id}`, {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              });
              if (planResponse.ok) {
                const planData = await planResponse.json();
                planName = planData.name || 'Unknown Plan';
              }
            } catch (error) {
              console.error('Error fetching plan:', error);
            }
            return {
              ...payment,
              user_name: payment.user ? payment.user.name : 'Unknown User',
              plan_name: planName,
              amount: payment.amount || 0,
              status: payment.status || 'Pending',
              created_at: payment.created_at || new Date().toISOString()
            }
          }));
          setPayments(transformedPayments);
        }
        setTimeout(() => setSuccessMessage(''), 2000);
      } else {
        setSuccessMessage('Failed to add payment.');
        setTimeout(() => setSuccessMessage(''), 2000);
      }
    } catch (error) {
      setSuccessMessage('Error adding payment.');
      setTimeout(() => setSuccessMessage(''), 2000);
    }
  };
  const handleAddClassSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/classes', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addClassForm),
      });
      if (response.ok) {
        setShowAddClassModal(false);
        setAddClassForm({ name: '', class_time: '', class_date: '', trainer_id: '', participants_count: 0 });
        setSuccessMessage('Class added successfully!');
        // Refresh classes
        const classesRes = await fetch('http://localhost:8000/api/classes', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (classesRes.ok) {
          const data = await classesRes.json();
          setClasses(data);
        }
        setTimeout(() => setSuccessMessage(''), 2000);
      } else {
        setSuccessMessage('Failed to add class.');
        setTimeout(() => setSuccessMessage(''), 2000);
      }
    } catch (error) {
      setSuccessMessage('Error adding class.');
      setTimeout(() => setSuccessMessage(''), 2000);
    }
  };

  const [classSearchQuery, setClassSearchQuery] = useState('');
  const [contacters, setContacters] = useState([]);
  const [respondingId, setRespondingId] = useState(null);
  const [faqForm, setFaqForm] = useState({ question: '', answer: '' });
  const [faqSuccess, setFaqSuccess] = useState('');
  const [payments, setPayments] = useState([]);
  const [paymentSearchQuery, setPaymentSearchQuery] = useState('');
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [addPaymentForm, setAddPaymentForm] = useState({ user_id: '', plan_id: '', amount: '', payment_date: new Date().toISOString().split('T')[0], status: 'Pending' });
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8000/api/users', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          setUsers([]);
        }
      } catch (error) {
        setUsers([]);
      }
    };
    fetchUsers();
  }, []);

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

  useEffect(() => {
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
        } else {
          setClasses([]);
        }
      } catch (error) {
        setClasses([]);
      }
    };
    fetchClasses();
  }, []);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem('token');

        // Then fetch payments with user data
        const response = await fetch('http://localhost:8000/api/payments', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          // Transform the data to include user and plan details
          const transformedPayments = await Promise.all(data.map(async payment => {
            // Fetch plan details for each payment
            let planName = 'Unknown Plan';
            try {
              console.log('Fetching plan for payment:', payment.id, 'plan_id:', payment.plan_id);
              const planResponse = await fetch(`http://localhost:8000/api/plans/${payment.plan_id}`, {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              });
              if (planResponse.ok) {
                const planData = await planResponse.json();
                console.log('Plan data received:', planData);
                planName = planData.name || 'Unknown Plan';
              } else {
                console.error('Plan fetch failed:', await planResponse.text());
              }
            } catch (error) {
              console.error('Error fetching plan:', error);
              console.error('Payment details:', payment);
            }
            
            return {
              ...payment,
              user_name: payment.user ? payment.user.name : 'Unknown User',
              plan_name: planName,
              amount: payment.amount || 0,
              status: payment.status || 'Pending',
              created_at: payment.created_at || new Date().toISOString()
            }
          })
        );
          setPayments(transformedPayments);
        } else {
          setPayments([]);
        }
      } catch (error) {
        console.error('Error fetching payments:', error);
        setPayments([]);
      }
    };
    fetchPayments();
  }, []);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8000/api/plans', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          setPlans(data);
        } else {
          setPlans([]);
        }
      } catch (error) {
        setPlans([]);
      }
    };
    fetchPlans();
  }, []);

  useEffect(() => {
    if (showReportsModal) {
      const fetchContacters = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch('http://localhost:8000/api/contacter', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          if (response.ok) {
            const data = await response.json();
            setContacters(data);
          } else {
            setContacters([]);
          }
        } catch (error) {
          setContacters([]);
        }
      };
      fetchContacters();
    }
  }, [showReportsModal]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (showUsersModal && offcanvasRef.current && !offcanvasRef.current.contains(event.target)) {
        toggleUsersModal();
      }
      if (editUser && modalRef.current && !modalRef.current.contains(event.target)) {
        handleEditCancel();
      }
      if (showClassesModal && classesOffcanvasRef.current && !classesOffcanvasRef.current.contains(event.target)) {
        toggleClassesModal();
      }
      if (showPaymentsModal && paymentsOffcanvasRef.current && !paymentsOffcanvasRef.current.contains(event.target)) {
        togglePaymentsModal();
      }
      if (showReportsModal && reportsOffcanvasRef.current && !reportsOffcanvasRef.current.contains(event.target)) {
        toggleReportsModal();
      }
      if (showAddUserModal && addUserModalRef.current && !addUserModalRef.current.contains(event.target)) {
        setShowAddUserModal(false);
      }
      if (editClass && editClassModalRef.current && !editClassModalRef.current.contains(event.target)) {
        handleEditClassCancel();
      }
      if (showAddClassModal && addClassModalRef.current && !addClassModalRef.current.contains(event.target)) {
        setShowAddClassModal(false);
      }
    }
    if (showUsersModal || editUser || showClassesModal || showPaymentsModal || showReportsModal || showAddUserModal || editClass || showAddClassModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUsersModal, editUser, showClassesModal, showPaymentsModal, showReportsModal, showAddUserModal, editClass, showAddClassModal]);

  return (
    <div className="admins-dashboard">
      {/* Navbar */}
      <Navbar userName={userName} />

      {/* Header */}
      <header id="header">
        <video src="../../public/img/video.mp4" autoPlay loop muted></video>
        <div className="overlay"></div>
        <div className="container py-5">
          <h1 className="text-white" style={{ fontSize: '5rem' }} data-aos="fade-right" data-aos-duration="2000">
            Admins Dashboard
          </h1>
          <h3 className="text-white" style={{ fontSize: '2rem' }} data-aos="fade-left" data-aos-duration="2000">
            Manage users, classes, payments, and reports
          </h3>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="dashboard-container container py-5">
        <div className="row">
          {/* Manage Users Section */}
          <div className="col-md-3">
            <div className="card section-card" data-aos="fade-up" data-aos-duration="1000" style={{
              background: 'linear-gradient(135deg, #F8F9FA 0%, #E3F2FD 100%)',
              border: '2px solid #38B6FF',
              borderRadius: '15px',
              boxShadow: '0 8px 25px rgba(56, 182, 255, 0.15)'
            }}>
              <h2 className="card-title" style={{ color: '#007BFF', fontWeight: 'bold' }}>Manage Users</h2>
              <p style={{ color: '#4A4A4A' }}>View, edit, or delete users.</p>
              <button 
                className="btn"
                onClick={toggleUsersModal}
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
                Users
              </button>
            </div>
          </div>

          {/* Manage Classes Section */}
          <div className="col-md-3">
            <div className="card section-card" data-aos="fade-up" data-aos-duration="1500" style={{
              background: 'linear-gradient(135deg, #F8F9FA 0%, #E8F5E8 100%)',
              border: '2px solid #2ECC71',
              borderRadius: '15px',
              boxShadow: '0 8px 25px rgba(46, 204, 113, 0.15)'
            }}>
              <h2 className="card-title" style={{ color: '#007BFF', fontWeight: 'bold' }}>Manage Classes</h2>
              <p style={{ color: '#4A4A4A' }}>View, edit, or delete classes.</p>
              <button 
                className="btn"
                onClick={toggleClassesModal}
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
                Classes
              </button>
            </div>
          </div>

          {/* Manage Payments Section */}
          <div className="col-md-3">
            <div className="card section-card" data-aos="fade-up" data-aos-duration="2000" style={{
              background: 'linear-gradient(135deg, #F8F9FA 0%, #FFF3E0 100%)',
              border: '2px solid #38B6FF',
              borderRadius: '15px',
              boxShadow: '0 8px 25px rgba(56, 182, 255, 0.15)'
            }}>
              <h2 className="card-title" style={{ color: '#007BFF', fontWeight: 'bold' }}>Manage Payments</h2>
              <p style={{ color: '#4A4A4A' }}>View and manage payments.</p>
              <button 
                className="btn"
                onClick={togglePaymentsModal}
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
                Payments
              </button>
            </div>
          </div>

          {/* Reports Section */}
          <div className="col-md-3">
            <div className="card section-card" data-aos="fade-up" data-aos-duration="2500" style={{
              background: 'linear-gradient(135deg, #F8F9FA 0%, #E8F5E8 100%)',
              border: '2px solid #2ECC71',
              borderRadius: '15px',
              boxShadow: '0 8px 25px rgba(46, 204, 113, 0.15)'
            }}>
              <h2 className="card-title" style={{ color: '#007BFF', fontWeight: 'bold' }}>Reports</h2>
              <p style={{ color: '#4A4A4A' }}>Generate and view reports.</p>
              <button 
                className="btn"
                onClick={toggleReportsModal}
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
                Reports
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Manage Users Modal */}
      {showUsersModal && (
        <div className="offcanvas offcanvas-end show" tabIndex="-1" id="usersModal" aria-labelledby="offcanvasLabel" ref={offcanvasRef} style={{ backgroundColor: '#F8F9FA' }}>
          <div className="offcanvas-header" style={{ backgroundColor: '#007BFF', borderBottom: '2px solid #38B6FF' }}>
            <h5 className="offcanvas-title" style={{ color: '#F8F9FA', fontWeight: 'bold' }}>Manage Users</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={toggleUsersModal} style={{ filter: 'invert(1)' }}></button>
          </div>
          <div className="offcanvas-body" style={{ backgroundColor: '#F8F9FA', color: '#4A4A4A' }}>
            <button 
              className="btn mb-3" 
              onClick={() => setShowAddUserModal(true)}
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
              Add User
            </button>
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                border: '2px solid #38B6FF',
                borderRadius: '10px',
                backgroundColor: '#FFFFFF',
                color: '#343A40',
                padding: '12px 15px'
              }}
            />
            <ul className="list-group">
              {successMessage && <div className="alert alert-success mb-2" style={{ backgroundColor: '#E8F5E8', border: '1px solid #2ECC71', color: '#2ECC71' }}>{successMessage}</div>}
              {users.filter(user =>
                user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(searchQuery.toLowerCase())
              ).map((user) => (
                <li key={user.id} className="list-group-item" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E0E0E0', borderRadius: '8px', marginBottom: '8px' }}>
                  <div className="d-flex justify-content-between align-items-center">
                    <div style={{ color: '#4A4A4A' }}>
                      <div><strong>{user.name}</strong> ({user.email})</div>
                      <small className="text-muted">Role: {user.role}</small>
                      {user.role === 'member' && (
                        <div>
                          <span className={`badge ${
                            user.subscription_status === 'active' ? 'bg-success' : 
                            user.subscription_status === 'expired' ? 'bg-danger' : 
                            user.subscription_status === 'cancelled' ? 'bg-warning' : 'bg-secondary'
                          } ms-2`} style={{
                            backgroundColor: 
                              user.subscription_status === 'active' ? '#2ECC71' : 
                              user.subscription_status === 'expired' ? '#DC3545' : 
                              user.subscription_status === 'cancelled' ? '#FFC107' : '#6C757D',
                            color: '#F8F9FA',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '0.8em'
                          }}>
                            {user.subscription_status === 'expired' ? '⚠️ Expired' : 
                             user.subscription_status === 'active' ? '✅ Active' :
                             user.subscription_status === 'cancelled' ? '❌ Cancelled' :
                             '❓ No Subscription'}
                          </span>
                          {user.subscription_end_date && (
                            <div style={{ fontSize: '0.75em', color: '#6C757D', marginTop: '2px' }}>
                              {user.subscription_status === 'expired' ? 'Expired on: ' : 'Expires: '}
                              {new Date(user.subscription_end_date).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div>
                      <button 
                        className="btn btn-sm mx-1" 
                        onClick={() => handleEditClick(user)}
                        style={{
                          backgroundColor: '#FFC107',
                          color: '#343A40',
                          border: 'none',
                          borderRadius: '15px',
                          padding: '5px 12px'
                        }}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-sm mx-1" 
                        onClick={() => handleDeleteUser(user.id)}
                        style={{
                          backgroundColor: '#FF6B6B',
                          color: '#F8F9FA',
                          border: 'none',
                          borderRadius: '15px',
                          padding: '5px 12px'
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            {editUser && (
              <div className="modal show d-block" tabIndex="-1" ref={modalRef}>
                <div className="modal-dialog">
                  <div className="modal-content" style={{ backgroundColor: '#F8F9FA', border: '2px solid #38B6FF', borderRadius: '15px' }}>
                    <div className="modal-header" style={{ backgroundColor: '#007BFF', borderBottom: '2px solid #38B6FF' }}>
                      <h5 className="modal-title" style={{ color: '#F8F9FA', fontWeight: 'bold' }}>Edit User</h5>
                      <button type="button" className="btn-close" aria-label="Close" onClick={handleEditCancel} style={{ filter: 'invert(1)' }}></button>
                    </div>
                    <form onSubmit={handleEditSubmit}>
                      <div className="modal-body" style={{ backgroundColor: '#F8F9FA', color: '#4A4A4A' }}>
                        <div className="mb-3">
                          <label className="form-label" style={{ color: '#343A40', fontWeight: 'bold' }}>Name</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            name="name" 
                            value={editForm.name} 
                            onChange={handleEditFormChange} 
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
                          <label className="form-label" style={{ color: '#343A40', fontWeight: 'bold' }}>Email</label>
                          <input 
                            type="email" 
                            className="form-control" 
                            name="email" 
                            value={editForm.email} 
                            onChange={handleEditFormChange} 
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
                          <label className="form-label" style={{ color: '#343A40', fontWeight: 'bold' }}>Role</label>
                          <select 
                            className="form-control" 
                            name="role" 
                            value={editForm.role} 
                            onChange={handleEditFormChange} 
                            required
                            style={{
                              border: '2px solid #38B6FF',
                              borderRadius: '10px',
                              backgroundColor: '#FFFFFF',
                              color: '#343A40',
                              padding: '12px 15px'
                            }}
                          >
                            <option value="admin">Admin</option>
                            <option value="trainer">Trainer</option>
                            <option value="member">Member</option>
                          </select>
                        </div>
                      </div>
                      <div className="modal-footer" style={{ backgroundColor: '#F8F9FA', borderTop: '2px solid #38B6FF' }}>
                        <button 
                          type="button" 
                          className="btn" 
                          onClick={handleEditCancel}
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
                            background: 'linear-gradient(135deg, #38B6FF 0%, #1E88E5 100%)',
                            color: '#F8F9FA',
                            border: 'none',
                            borderRadius: '20px',
                            padding: '10px 20px',
                            fontWeight: 'bold'
                          }}
                        >
                          Save
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
            {/* Add User Modal */}
            {showAddUserModal && (
              <div className="modal show d-block" tabIndex="-1" ref={addUserModalRef}>
                <div className="modal-dialog">
                  <div className="modal-content" style={{ backgroundColor: '#F8F9FA', border: '2px solid #2ECC71', borderRadius: '15px' }}>
                    <div className="modal-header" style={{ backgroundColor: '#2ECC71', borderBottom: '2px solid #27AE60' }}>
                      <h5 className="modal-title" style={{ color: '#F8F9FA', fontWeight: 'bold' }}>Add User</h5>
                      <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowAddUserModal(false)} style={{ filter: 'invert(1)' }}></button>
                    </div>
                    <form onSubmit={handleAddUserSubmit}>
                      <div className="modal-body" style={{ backgroundColor: '#F8F9FA', color: '#4A4A4A' }}>
                        <div className="mb-3">
                          <label className="form-label" style={{ color: '#343A40', fontWeight: 'bold' }}>Name</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            name="name" 
                            value={addUserForm.name} 
                            onChange={handleAddUserFormChange} 
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
                          <label className="form-label" style={{ color: '#343A40', fontWeight: 'bold' }}>Email</label>
                          <input 
                            type="email" 
                            className="form-control" 
                            name="email" 
                            value={addUserForm.email} 
                            onChange={handleAddUserFormChange} 
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
                          <label className="form-label" style={{ color: '#343A40', fontWeight: 'bold' }}>Role</label>
                          <select 
                            className="form-control" 
                            name="role" 
                            value={addUserForm.role} 
                            onChange={handleAddUserFormChange} 
                            required
                            style={{
                              border: '2px solid #2ECC71',
                              borderRadius: '10px',
                              backgroundColor: '#FFFFFF',
                              color: '#343A40',
                              padding: '12px 15px'
                            }}
                          >
                            <option value="admin">Admin</option>
                            <option value="trainer">Trainer</option>
                            <option value="member">Member</option>
                          </select>
                        </div>
                        <div className="mb-3">
                          <label className="form-label" style={{ color: '#343A40', fontWeight: 'bold' }}>Password</label>
                          <input 
                            type="password" 
                            className="form-control" 
                            name="password" 
                            value={addUserForm.password} 
                            onChange={handleAddUserFormChange} 
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
                      </div>
                      <div className="modal-footer" style={{ backgroundColor: '#F8F9FA', borderTop: '2px solid #2ECC71' }}>
                        <button 
                          type="button" 
                          className="btn" 
                          onClick={() => setShowAddUserModal(false)}
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
                          Add
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Manage Classes Modal */}
      {showClassesModal && (
        <div className="offcanvas offcanvas-end show" tabIndex="-1" id="classesModal" aria-labelledby="offcanvasLabel" ref={classesOffcanvasRef} style={{ backgroundColor: '#F8F9FA' }}>
          <div className="offcanvas-header" style={{ backgroundColor: '#2ECC71', borderBottom: '2px solid #27AE60' }}>
            <h5 className="offcanvas-title" style={{ color: '#F8F9FA', fontWeight: 'bold' }}>Manage Classes</h5>
            <button type="button" className="btn-close" onClick={toggleClassesModal} aria-label="Close" style={{ filter: 'invert(1)' }}></button>
          </div>
          <div className="offcanvas-body" style={{ backgroundColor: '#F8F9FA', color: '#4A4A4A' }}>
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
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Search by class name or trainer ID..."
              value={classSearchQuery}
              onChange={e => setClassSearchQuery(e.target.value)}
              style={{
                border: '2px solid #2ECC71',
                borderRadius: '10px',
                backgroundColor: '#FFFFFF',
                color: '#343A40',
                padding: '12px 15px'
              }}
            />
            <ul className="list-group">
              {classes.filter(classItem =>
                classItem.name.toLowerCase().includes(classSearchQuery.toLowerCase()) ||
                (classItem.trainer_id && classItem.trainer_id.toString().includes(classSearchQuery))
              ).map((classItem) => (
                <li key={classItem.id} className="list-group-item d-flex justify-content-between align-items-center" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E0E0E0', borderRadius: '8px', marginBottom: '8px' }}>
                  <span style={{ color: '#4A4A4A' }}>{classItem.name} ({classItem.participants_count} participants)</span>
                  <div>
                    <button 
                      className="btn btn-sm mx-1" 
                      onClick={() => handleEditClassClick(classItem)}
                      style={{
                        backgroundColor: '#FFC107',
                        color: '#343A40',
                        border: 'none',
                        borderRadius: '15px',
                        padding: '5px 12px'
                      }}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-sm mx-1" 
                      onClick={() => handleDeleteClass(classItem.id)}
                      style={{
                        backgroundColor: '#FF6B6B',
                        color: '#F8F9FA',
                        border: 'none',
                        borderRadius: '15px',
                        padding: '5px 12px'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            {/* Edit Class Modal */}
            {editClass && (
              <div className="modal show d-block" tabIndex="-1" ref={editClassModalRef}>
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Edit Class</h5>
                      <button type="button" className="btn-close" aria-label="Close" onClick={handleEditClassCancel}></button>
                    </div>
                    <form onSubmit={handleEditClassSubmit}>
                      <div className="modal-body">
                        <div className="mb-3">
                          <label className="form-label">Name</label>
                          <input type="text" className="form-control" name="name" value={editClassForm.name} onChange={handleEditClassFormChange} required />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Time</label>
                          <input type="time" className="form-control" name="class_time" value={editClassForm.class_time} onChange={handleEditClassFormChange} required />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Date</label>
                          <input type="date" className="form-control" name="class_date" value={editClassForm.class_date} onChange={handleEditClassFormChange} required />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Trainer ID</label>
                          <input type="number" className="form-control" name="trainer_id" value={editClassForm.trainer_id} onChange={handleEditClassFormChange} />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Participants</label>
                          <input type="number" className="form-control" name="participants_count" value={editClassForm.participants_count} onChange={handleEditClassFormChange} min="0" />
                        </div>
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={handleEditClassCancel}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Save</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
            {/* Add Class Modal */}
            {showAddClassModal && (
              <div className="modal show d-block" tabIndex="-1" ref={addClassModalRef}>
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Add Class</h5>
                      <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowAddClassModal(false)}></button>
                    </div>
                    <form onSubmit={handleAddClassSubmit}>
                      <div className="modal-body">
                        <div className="mb-3">
                          <label className="form-label">Name</label>
                          <input type="text" className="form-control" name="name" value={addClassForm.name} onChange={handleAddClassFormChange} required />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Time</label>
                          <input type="time" className="form-control" name="class_time" value={addClassForm.class_time.slice(0,5)} onChange={handleAddClassFormChange} required />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Date</label>
                          <input type="date" className="form-control" name="class_date" value={addClassForm.class_date} onChange={handleAddClassFormChange} required />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Trainer ID</label>
                          <input type="number" className="form-control" name="trainer_id" value={addClassForm.trainer_id} onChange={handleAddClassFormChange} />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Participants</label>
                          <input type="number" className="form-control" name="participants_count" value={addClassForm.participants_count} onChange={handleAddClassFormChange} min="0" />
                        </div>
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={() => setShowAddClassModal(false)}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Add</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Manage Payments Modal */}
      {showPaymentsModal && (
        <div className="offcanvas offcanvas-end show" tabIndex="-1" id="paymentsModal" aria-labelledby="offcanvasLabel" ref={paymentsOffcanvasRef} style={{ backgroundColor: '#F8F9FA' }}>
          <div className="offcanvas-header" style={{ backgroundColor: '#38B6FF', borderBottom: '2px solid #007BFF' }}>
            <h5 className="offcanvas-title" style={{ color: '#F8F9FA', fontWeight: 'bold' }}>Manage Payments</h5>
            <button type="button" className="btn-close" onClick={togglePaymentsModal} aria-label="Close" style={{ filter: 'invert(1)' }}></button>
          </div>
          <div className="offcanvas-body" style={{ backgroundColor: '#F8F9FA', color: '#4A4A4A' }}>
            <div className="mb-3">
              <button 
                className="btn w-100" 
                onClick={() => setShowAddPaymentModal(true)}
                style={{
                  background: 'linear-gradient(135deg, #2ECC71 0%, #27AE60 100%)',
                  color: '#F8F9FA',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '12px 20px',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 12px rgba(46, 204, 113, 0.3)',
                  marginBottom: '15px'
                }}
              >
                Add Payment
              </button>
            </div>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Search by user name or payment status..."
                value={paymentSearchQuery}
                onChange={e => setPaymentSearchQuery(e.target.value)}
                style={{
                  border: '2px solid #38B6FF',
                  borderRadius: '10px',
                  backgroundColor: '#FFFFFF',
                  color: '#343A40',
                  padding: '12px 15px'
                }}
              />
            </div>
            <div className="table-responsive">
              <table className="table table-striped" style={{ backgroundColor: '#FFFFFF', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <thead>
                  <tr style={{ backgroundColor: '#007BFF' }}>
                    <th style={{ color: '#F8F9FA', fontWeight: 'bold' }}>User</th>
                    <th style={{ color: '#F8F9FA', fontWeight: 'bold' }}>Plan</th>
                    <th style={{ color: '#F8F9FA', fontWeight: 'bold' }}>Amount</th>
                    <th style={{ color: '#F8F9FA', fontWeight: 'bold' }}>Status</th>
                    <th style={{ color: '#F8F9FA', fontWeight: 'bold' }}>Date</th>
                    <th style={{ color: '#F8F9FA', fontWeight: 'bold' }}>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.filter(payment =>
                    payment.user_name?.toLowerCase().includes(paymentSearchQuery.toLowerCase()) ||
                    payment.plan_name?.toLowerCase().includes(paymentSearchQuery.toLowerCase()) ||
                    payment.status?.toLowerCase().includes(paymentSearchQuery.toLowerCase())
                  ).map((payment) => (
                    <tr key={payment.id} style={{ backgroundColor: '#F8F9FA' }}>
                      <td style={{ color: '#4A4A4A' }}>{payment.user_name}</td>
                      <td style={{ color: '#4A4A4A' }}>{payment.plan_name}</td>
                      <td>
                        <div style={{ color: '#2ECC71', fontWeight: 'bold' }}>
                          ${Number(payment.amount).toFixed(2)}
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${
                          payment.status === 'Paid' ? 'bg-success' : 
                          payment.status === 'Pending' ? 'bg-warning' : 'bg-danger'
                        }`} style={{
                          backgroundColor: payment.status === 'Paid' ? '#2ECC71' : 
                                         payment.status === 'Pending' ? '#FFC107' : '#FF6B6B',
                          color: '#F8F9FA',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '0.8em'
                        }}>
                          {payment.status}
                        </span>
                      </td>
                      <td style={{ color: '#4A4A4A' }}>
                        <div>{new Date(payment.created_at).toLocaleDateString()}</div>
                        <small style={{ color: '#6C757D' }}>
                          {new Date(payment.created_at).toLocaleTimeString()}
                        </small>
                      </td>
                      <td>
                        <button 
                          className="btn btn-sm"
                          title="View Details"
                          onClick={() => alert('Payment Details:\n' + 
                            `User: ${payment.user_name}\n` +
                            `Plan: ${payment.plan_name}\n` +
                            `Amount: $${Number(payment.amount).toFixed(2)}\n` +
                            `Status: ${payment.status}\n` +
                            `Date: ${new Date(payment.created_at).toLocaleString()}`
                          )}
                          style={{
                            backgroundColor: '#38B6FF',
                            color: '#F8F9FA',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '5px 10px'
                          }}
                        >
                          <i className="fas fa-info-circle"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {payments.length === 0 && (
                <div className="text-center py-3" style={{ backgroundColor: '#FFFFFF', borderRadius: '10px', border: '1px solid #E0E0E0', color: '#4A4A4A' }}>
                  <p>No payments found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reports Modal */}
      {showReportsModal && (
        <div className="offcanvas offcanvas-end show" tabIndex="-1" id="reportsModal" aria-labelledby="offcanvasLabel" ref={reportsOffcanvasRef} style={{ backgroundColor: '#F8F9FA' }}>
          <div className="offcanvas-header" style={{ backgroundColor: '#2ECC71', borderBottom: '2px solid #27AE60' }}>
            <h5 className="offcanvas-title" style={{ color: '#F8F9FA', fontWeight: 'bold' }}>Reports</h5>
            <button type="button" className="btn-close" onClick={toggleReportsModal} aria-label="Close" style={{ filter: 'invert(1)' }}></button>
          </div>
          <div className="offcanvas-body" style={{ backgroundColor: '#F8F9FA', color: '#4A4A4A' }}>
            <h6 style={{ color: '#007BFF', fontWeight: 'bold', marginBottom: '15px' }}>Contact Messages</h6>
            <ul className="list-group mb-3">
              {contacters.length === 0 && <li className="list-group-item" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E0E0E0', borderRadius: '8px', color: '#4A4A4A' }}>No contact messages found.</li>}
              {contacters.map((c) => (
                <li key={c.id} className="list-group-item" style={{ 
                  textAlign: 'left', 
                  display: 'block', 
                  backgroundColor: '#FFFFFF', 
                  border: '1px solid #E0E0E0', 
                  borderRadius: '8px', 
                  marginBottom: '10px',
                  padding: '15px'
                }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#007BFF' }}>{c.email}</div>
                  <div style={{ marginLeft: 0, color: '#4A4A4A', marginBottom: '10px' }}>{c.message}</div>
                  <div className="d-flex gap-2">
                    <button 
                      className="btn btn-sm mt-2" 
                      onClick={() => { setRespondingId(c.id); setFaqForm({ question: c.message, answer: '' }); }}
                      style={{
                        backgroundColor: '#38B6FF',
                        color: '#F8F9FA',
                        border: 'none',
                        borderRadius: '15px',
                        padding: '6px 15px',
                        fontWeight: 'bold'
                      }}
                    >
                      Add Response
                    </button>
                    <button 
                      className="btn btn-sm mt-2" 
                      onClick={async () => {
                        if (window.confirm('Are you sure you want to delete this contact message?')) {
                          try {
                            const token = localStorage.getItem('token');
                            const res = await fetch(`http://localhost:8000/api/contacter/${c.id}`, {
                              method: 'DELETE',
                              headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json',
                              },
                            });
                            if (res.ok) {
                              // Remove the deleted contact from the local state
                              setContacters(prevContacters => prevContacters.filter(contact => contact.id !== c.id));
                            } else {
                              alert('Failed to delete contact message.');
                            }
                          } catch (error) {
                            console.error('Error deleting contact:', error);
                            alert('Error deleting contact message.');
                          }
                        }
                      }}
                      style={{
                        backgroundColor: '#DC3545',
                        color: '#F8F9FA',
                        border: 'none',
                        borderRadius: '15px',
                        padding: '6px 15px',
                        fontWeight: 'bold'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                  {respondingId === c.id && (
                    <form className="mt-2 p-3 border rounded" style={{ 
                      maxWidth: 400, 
                      backgroundColor: '#F8F9FA', 
                      border: '2px solid #38B6FF !important',
                      borderRadius: '10px'
                    }} onSubmit={async (e) => {
                      e.preventDefault();
                      const token = localStorage.getItem('token');
                      const res = await fetch('http://localhost:8000/api/faq', {
                        method: 'POST',
                        headers: {
                          'Authorization': `Bearer ${token}`,
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(faqForm),
                      });
                      if (res.ok) {
                        setFaqSuccess('FAQ added successfully!');
                        setTimeout(() => setFaqSuccess(''), 2000);
                        setRespondingId(null);
                      } else {
                        setFaqSuccess('Failed to add FAQ.');
                        setTimeout(() => setFaqSuccess(''), 2000);
                      }
                    }}>
                      <div className="mb-3">
                        <label className="form-label" style={{ color: '#343A40', fontWeight: 'bold' }}>Question</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          value={faqForm.question} 
                          onChange={e => setFaqForm(f => ({ ...f, question: e.target.value }))} 
                          required 
                          style={{
                            border: '2px solid #38B6FF',
                            borderRadius: '8px',
                            backgroundColor: '#FFFFFF',
                            color: '#343A40',
                            padding: '10px'
                          }}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label" style={{ color: '#343A40', fontWeight: 'bold' }}>Response</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          value={faqForm.answer} 
                          onChange={e => setFaqForm(f => ({ ...f, answer: e.target.value }))} 
                          required 
                          style={{
                            border: '2px solid #38B6FF',
                            borderRadius: '8px',
                            backgroundColor: '#FFFFFF',
                            color: '#343A40',
                            padding: '10px'
                          }}
                        />
                      </div>
                      <div className="d-flex justify-content-end">
                        <button 
                          type="submit" 
                          className="btn me-2"
                          style={{
                            background: 'linear-gradient(135deg, #2ECC71 0%, #27AE60 100%)',
                            color: '#F8F9FA',
                            border: 'none',
                            borderRadius: '15px',
                            padding: '8px 16px',
                            fontWeight: 'bold'
                          }}
                        >
                          Confirm
                        </button>
                        <button 
                          type="button" 
                          className="btn" 
                          onClick={() => setRespondingId(null)}
                          style={{
                            backgroundColor: '#6C757D',
                            color: '#F8F9FA',
                            border: 'none',
                            borderRadius: '15px',
                            padding: '8px 16px'
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </li>
              ))}
            </ul>
            {faqSuccess && <div className="alert alert-success mt-2" style={{ backgroundColor: '#E8F5E8', border: '1px solid #2ECC71', color: '#2ECC71' }}>{faqSuccess}</div>}
          </div>
        </div>
      )}

      {/* Add Payment Modal */}
      {showAddPaymentModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content" style={{ backgroundColor: '#F8F9FA', borderRadius: '15px', border: '2px solid #38B6FF' }}>
              <div className="modal-header" style={{ backgroundColor: '#007BFF', borderBottom: '2px solid #38B6FF', borderRadius: '15px 15px 0 0' }}>
                <h5 className="modal-title" style={{ color: '#F8F9FA', fontWeight: 'bold' }}>Add New Payment</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowAddPaymentModal(false)}
                  style={{ filter: 'invert(1)' }}
                ></button>
              </div>
              <div className="modal-body" style={{ backgroundColor: '#F8F9FA', color: '#4A4A4A' }}>
                <form onSubmit={handleAddPaymentSubmit}>
                  <div className="mb-3">
                    <label className="form-label" style={{ fontWeight: 'bold', color: '#007BFF' }}>User</label>
                    <select
                      className="form-select"
                      name="user_id"
                      value={addPaymentForm.user_id}
                      onChange={handleAddPaymentFormChange}
                      required
                      style={{
                        border: '2px solid #38B6FF',
                        borderRadius: '10px',
                        backgroundColor: '#FFFFFF',
                        color: '#343A40',
                        padding: '10px 15px'
                      }}
                    >
                      <option value="">Select a user</option>
                      {users.map(user => (
                        <option key={user.id} value={user.id}>{user.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label" style={{ fontWeight: 'bold', color: '#007BFF' }}>Plan</label>
                    <select
                      className="form-select"
                      name="plan_id"
                      value={addPaymentForm.plan_id}
                      onChange={handleAddPaymentFormChange}
                      required
                      style={{
                        border: '2px solid #38B6FF',
                        borderRadius: '10px',
                        backgroundColor: '#FFFFFF',
                        color: '#343A40',
                        padding: '10px 15px'
                      }}
                    >
                      <option value="">Select a plan</option>
                      {plans.map(plan => (
                        <option key={plan.id} value={plan.id}>{plan.name} - ${plan.price}</option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label" style={{ fontWeight: 'bold', color: '#007BFF' }}>Amount</label>
                    <input
                      type="number"
                      className="form-control"
                      name="amount"
                      value={addPaymentForm.amount}
                      onChange={handleAddPaymentFormChange}
                      step="0.01"
                      min="0"
                      required
                      style={{
                        border: '2px solid #38B6FF',
                        borderRadius: '10px',
                        backgroundColor: '#FFFFFF',
                        color: '#343A40',
                        padding: '10px 15px'
                      }}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label" style={{ fontWeight: 'bold', color: '#007BFF' }}>Payment Date</label>
                    <input
                      type="date"
                      className="form-control"
                      name="payment_date"
                      value={addPaymentForm.payment_date}
                      onChange={handleAddPaymentFormChange}
                      required
                      style={{
                        border: '2px solid #38B6FF',
                        borderRadius: '10px',
                        backgroundColor: '#FFFFFF',
                        color: '#343A40',
                        padding: '10px 15px'
                      }}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label" style={{ fontWeight: 'bold', color: '#007BFF' }}>Status</label>
                    <select
                      className="form-select"
                      name="status"
                      value={addPaymentForm.status}
                      onChange={handleAddPaymentFormChange}
                      required
                      style={{
                        border: '2px solid #38B6FF',
                        borderRadius: '10px',
                        backgroundColor: '#FFFFFF',
                        color: '#343A40',
                        padding: '10px 15px'
                      }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                      <option value="Failed">Failed</option>
                    </select>
                  </div>

                  <div className="d-flex justify-content-end gap-2">
                    <button
                      type="button"
                      className="btn"
                      onClick={() => setShowAddPaymentModal(false)}
                      style={{
                        backgroundColor: '#6C757D',
                        color: '#F8F9FA',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '10px 20px',
                        fontWeight: 'bold'
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
                        borderRadius: '10px',
                        padding: '10px 20px',
                        fontWeight: 'bold',
                        boxShadow: '0 4px 12px rgba(46, 204, 113, 0.3)'
                      }}
                    >
                      Add Payment
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AdminsDashboard;

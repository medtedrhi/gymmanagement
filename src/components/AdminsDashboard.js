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
  const [addClassForm, setAddClassForm] = useState({ name: '', classe_time: '', class_date: '', trainer_id: '', participants_count: 0 });

  const handleAddClassFormChange = (e) => {
    const { name, value } = e.target;
    // For classe_time, ensure value is in HH:mm:ss
    if (name === 'classe_time') {
      let formatted = value;
      if (value.length === 5) formatted = value + ':00';
      setAddClassForm((prev) => ({ ...prev, [name]: formatted }));
    } else {
      setAddClassForm((prev) => ({ ...prev, [name]: value }));
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
        setAddClassForm({ name: '', classe_time: '', class_date: '', trainer_id: '', participants_count: 0 });
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
            <div className="card section-card" data-aos="fade-up" data-aos-duration="1000">
              <h2 className="card-title">Manage Users</h2>
              <p>View, edit, or delete users.</p>
              <button className="btn btn-primary" onClick={toggleUsersModal}>
                Users
              </button>
            </div>
          </div>

          {/* Manage Classes Section */}
          <div className="col-md-3">
            <div className="card section-card" data-aos="fade-up" data-aos-duration="1500">
              <h2 className="card-title">Manage Classes</h2>
              <p>View, edit, or delete classes.</p>
              <button className="btn btn-primary" onClick={toggleClassesModal}>
                Classes
              </button>
            </div>
          </div>

          {/* Manage Payments Section */}
          <div className="col-md-3">
            <div className="card section-card" data-aos="fade-up" data-aos-duration="2000">
              <h2 className="card-title">Manage Payments</h2>
              <p>View and manage payments.</p>
              <button className="btn btn-primary" onClick={togglePaymentsModal}>
                Payments
              </button>
            </div>
          </div>

          {/* Reports Section */}
          <div className="col-md-3">
            <div className="card section-card" data-aos="fade-up" data-aos-duration="2500">
              <h2 className="card-title">Reports</h2>
              <p>Generate and view reports.</p>
              <button className="btn btn-primary" onClick={toggleReportsModal}>
                Reports
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Manage Users Modal */}
      {showUsersModal && (
        <div className="offcanvas offcanvas-end show" tabIndex="-1" id="usersModal" aria-labelledby="offcanvasLabel" ref={offcanvasRef}>
          <div className="offcanvas-header">
            <h5 className="offcanvas-title">Manage Users</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={toggleUsersModal}></button>
          </div>
          <div className="offcanvas-body">
            <button className="btn btn-success mb-3" onClick={() => setShowAddUserModal(true)}>Add User</button>
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <ul className="list-group">
              {successMessage && <div className="alert alert-success mb-2">{successMessage}</div>}
              {users.filter(user =>
                user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(searchQuery.toLowerCase())
              ).map((user) => (
                <li key={user.id} className="list-group-item d-flex justify-content-between align-items-center">
                  {user.name} ({user.email})
                  <div>
                    <button className="btn btn-sm btn-warning mx-1" onClick={() => handleEditClick(user)}>Edit</button>
                    <button className="btn btn-sm btn-danger mx-1" onClick={() => handleDeleteUser(user.id)}>
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            {editUser && (
              <div className="modal show d-block" tabIndex="-1" ref={modalRef}>
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Edit User</h5>
                      <button type="button" className="btn-close" aria-label="Close" onClick={handleEditCancel}></button>
                    </div>
                    <form onSubmit={handleEditSubmit}>
                      <div className="modal-body">
                        <div className="mb-3">
                          <label className="form-label">Name</label>
                          <input type="text" className="form-control" name="name" value={editForm.name} onChange={handleEditFormChange} required />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Email</label>
                          <input type="email" className="form-control" name="email" value={editForm.email} onChange={handleEditFormChange} required />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Role</label>
                          <select className="form-control" name="role" value={editForm.role} onChange={handleEditFormChange} required>
                            <option value="admin">Admin</option>
                            <option value="trainer">Trainer</option>
                            <option value="member">Member</option>
                          </select>
                        </div>
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={handleEditCancel}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Save</button>
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
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Add User</h5>
                      <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowAddUserModal(false)}></button>
                    </div>
                    <form onSubmit={handleAddUserSubmit}>
                      <div className="modal-body">
                        <div className="mb-3">
                          <label className="form-label">Name</label>
                          <input type="text" className="form-control" name="name" value={addUserForm.name} onChange={handleAddUserFormChange} required />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Email</label>
                          <input type="email" className="form-control" name="email" value={addUserForm.email} onChange={handleAddUserFormChange} required />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Role</label>
                          <select className="form-control" name="role" value={addUserForm.role} onChange={handleAddUserFormChange} required>
                            <option value="admin">Admin</option>
                            <option value="trainer">Trainer</option>
                            <option value="member">Member</option>
                          </select>
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Password</label>
                          <input type="password" className="form-control" name="password" value={addUserForm.password} onChange={handleAddUserFormChange} required />
                        </div>
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={() => setShowAddUserModal(false)}>Cancel</button>
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

      {/* Manage Classes Modal */}
      {showClassesModal && (
        <div className="offcanvas offcanvas-end show" tabIndex="-1" id="classesModal" aria-labelledby="offcanvasLabel" ref={classesOffcanvasRef}>
          <div className="offcanvas-header">
            <h5 className="offcanvas-title">Manage Classes</h5>
            <button type="button" className="btn-close" onClick={toggleClassesModal} aria-label="Close"></button>
          </div>
          <div className="offcanvas-body">
            <button className="btn btn-success mb-3" onClick={() => setShowAddClassModal(true)}>Add Class</button>
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Search by class name or trainer ID..."
              value={classSearchQuery}
              onChange={e => setClassSearchQuery(e.target.value)}
            />
            <ul className="list-group">
              {classes.filter(classItem =>
                classItem.name.toLowerCase().includes(classSearchQuery.toLowerCase()) ||
                (classItem.trainer_id && classItem.trainer_id.toString().includes(classSearchQuery))
              ).map((classItem) => (
                <li key={classItem.id} className="list-group-item d-flex justify-content-between align-items-center">
                  {classItem.name} ({classItem.participants_count} participants)
                  <div>
                    <button className="btn btn-sm btn-warning mx-1" onClick={() => handleEditClassClick(classItem)}>Edit</button>
                    <button className="btn btn-sm btn-danger mx-1" onClick={() => handleDeleteClass(classItem.id)}>
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
                          <input type="time" className="form-control" name="classe_time" value={addClassForm.classe_time.slice(0,5)} onChange={handleAddClassFormChange} required />
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
        <div className="offcanvas offcanvas-end show" tabIndex="-1" id="paymentsModal" aria-labelledby="offcanvasLabel" ref={paymentsOffcanvasRef}>
          <div className="offcanvas-header">
            <h5 className="offcanvas-title">Manage Payments</h5>
            <button type="button" className="btn-close" onClick={togglePaymentsModal} aria-label="Close"></button>
          </div>
          <div className="offcanvas-body">
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Search by user name or payment status..."
              value={paymentSearchQuery}
              onChange={e => setPaymentSearchQuery(e.target.value)}
            />
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Plan</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.filter(payment =>
                    payment.user_name?.toLowerCase().includes(paymentSearchQuery.toLowerCase()) ||
                    payment.plan_name?.toLowerCase().includes(paymentSearchQuery.toLowerCase()) ||
                    payment.status?.toLowerCase().includes(paymentSearchQuery.toLowerCase())
                  ).map((payment) => (
                    <tr key={payment.id}>
                      <td>{payment.user_name}</td>
                      <td>{payment.plan_name}</td>
                      <td>
                        <div className="text-success">
                          ${Number(payment.amount).toFixed(2)}
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${
                          payment.status === 'Paid' ? 'bg-success' : 
                          payment.status === 'Pending' ? 'bg-warning' : 'bg-danger'
                        }`}>
                          {payment.status}
                        </span>
                      </td>
                      <td>
                        <div>{new Date(payment.created_at).toLocaleDateString()}</div>
                        <small className="text-muted">
                          {new Date(payment.created_at).toLocaleTimeString()}
                        </small>
                      </td>
                      <td>
                        <button 
                          className="btn btn-sm btn-outline-info"
                          title="View Details"
                          onClick={() => alert('Payment Details:\n' + 
                            `User: ${payment.user_name}\n` +
                            `Plan: ${payment.plan_name}\n` +
                            `Amount: $${Number(payment.amount).toFixed(2)}\n` +
                            `Status: ${payment.status}\n` +
                            `Date: ${new Date(payment.created_at).toLocaleString()}`
                          )}
                        >
                          <i className="fas fa-info-circle"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {payments.length === 0 && (
                <div className="text-center py-3">
                  <p>No payments found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reports Modal */}
      {showReportsModal && (
        <div className="offcanvas offcanvas-end show" tabIndex="-1" id="reportsModal" aria-labelledby="offcanvasLabel" ref={reportsOffcanvasRef}>
          <div className="offcanvas-header">
            <h5 className="offcanvas-title">Reports</h5>
            <button type="button" className="btn-close" onClick={toggleReportsModal} aria-label="Close"></button>
          </div>
          <div className="offcanvas-body">
            <h6>Contact Messages</h6>
            <ul className="list-group mb-3">
              {contacters.length === 0 && <li className="list-group-item">No contact messages found.</li>}
              {contacters.map((c) => (
                <li key={c.id} className="list-group-item" style={{ textAlign: 'left', display: 'block' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{c.email}</div>
                  <div style={{ marginLeft: 0 }}>{c.message}</div>
                  <button className="btn btn-sm btn-info mt-2" onClick={() => { setRespondingId(c.id); setFaqForm({ question: c.message, answer: '' }); }}>Add Response</button>
                  {respondingId === c.id && (
                    <form className="mt-2 p-3 border rounded bg-light" style={{ maxWidth: 400 }} onSubmit={async (e) => {
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
                        <label className="form-label">Question</label>
                        <input type="text" className="form-control" value={faqForm.question} onChange={e => setFaqForm(f => ({ ...f, question: e.target.value }))} required />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Response</label>
                        <input type="text" className="form-control" value={faqForm.answer} onChange={e => setFaqForm(f => ({ ...f, answer: e.target.value }))} required />
                      </div>
                      <div className="d-flex justify-content-end">
                        <button type="submit" className="btn btn-success me-2">Confirm</button>
                        <button type="button" className="btn btn-secondary" onClick={() => setRespondingId(null)}>Cancel</button>
                      </div>
                    </form>
                  )}
                </li>
              ))}
            </ul>
            {faqSuccess && <div className="alert alert-success mt-2">{faqSuccess}</div>}
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AdminsDashboard;

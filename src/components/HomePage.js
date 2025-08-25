import React, { useState, useEffect } from 'react';
import 'aos/dist/aos.css'; // Import AOS CSS for animations
import '../App.css'; // Import your custom CSS
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './fontawesome/css/fontawesome.css'; // Import FontAwesome
import './fontawesome/css/brands.css'; // Import FontAwesome Brands
import './fontawesome/css/solid.css'; // Import FontAwesome Solid
import './HomePage.css'; // Import your custom CSS file
import AOS from 'aos'; // Animate On Scroll library
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 
import { useNavigate } from 'react-router-dom';


AOS.init(); // Initialize AOS for animations

const HomePage = () => {
  const navigate = useNavigate();
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupStatus, setSignupStatus] = useState(null);
  const [plans, setPlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(true);

  // Light color palette from CSS variables - white and near-white tones
  const brightColors = [
    'linear-gradient(135deg, #F8F9FA 0%, #E9ECEF 100%)', // Light Gray to White
    'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)', // Very Light Blue tones
    'linear-gradient(135deg, #E8F5E8 0%, #C8E6C9 100%)', // Very Light Green tones
    'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)', // Very Light Orange/Cream
    'linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 100%)', // Very Light Purple tones
    'linear-gradient(135deg, #E0F2F1 0%, #B2DFDB 100%)', // Very Light Mint/Teal
  ];

  // Fetch plans from API
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/plans');
        if (response.ok) {
          const data = await response.json();
          setPlans(data);
        } else {
          console.error('Failed to fetch plans');
        }
      } catch (error) {
        console.error('Error fetching plans:', error);
      } finally {
        setPlansLoading(false);
      }
    };
    
    fetchPlans();
  }, []);

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setSignupStatus(null);
    if (signupPassword !== signupConfirmPassword) {
      setSignupStatus('Passwords do not match.');
      return;
    }
    try {
      const response = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: signupName,
          email: signupEmail,
          password: signupPassword,
          role: 'member',
        }),
      });
      if (response.ok) {
        setSignupStatus('Registration successful!');
        setSignupName('');
        setSignupEmail('');
        setSignupPassword('');
        setSignupConfirmPassword('');
      } else {
        const data = await response.json();
        setSignupStatus(data.message || 'Registration failed.');
      }
    } catch (error) {
      setSignupStatus('Registration failed.');
    }
  };

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginStatus, setLoginStatus] = useState(null);
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactStatus, setContactStatus] = useState(null);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginStatus(null);
    try {
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setLoginStatus('Login successful!');
        setLoginEmail('');
        setLoginPassword('');
        // Store token
        localStorage.setItem('token', data.token);
        // Fetch user info to get role
        const userRes = await fetch('http://localhost:8000/api/me', {
          headers: {
            'Authorization': `Bearer ${data.token}`,
            'Content-Type': 'application/json',
          },
        });
        if (userRes.ok) {
          const user = await userRes.json();
          // Close all open offcanvas elements and restore scrolling
          document.querySelectorAll('.offcanvas.show').forEach(el => {
            let offcanvas = null;
            if (window.bootstrap && window.bootstrap.Offcanvas) {
              offcanvas = window.bootstrap.Offcanvas.getInstance(el);
            } else if (window.$ && window.$.fn && window.$.fn.offcanvas) {
              offcanvas = window.$(el).offcanvas('hide');
            }
            if (offcanvas && offcanvas.hide) offcanvas.hide();
          });
          document.body.classList.remove('offcanvas-backdrop', 'modal-open');
          document.body.style.overflow = '';
          if (user.role === 'admin') navigate('/admin');
          else if (user.role === 'trainer') navigate('/trainer');
          else navigate('/member');
        } else {
          setLoginStatus('Failed to fetch user info.');
        }
      } else {
        const data = await response.json();
        setLoginStatus(data.error || data.message || 'Login failed.');
      }
    } catch (error) {
      setLoginStatus('Login failed.');
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactStatus(null);
    try {
      const response = await fetch('http://localhost:8000/api/contacter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: contactEmail,
          message: contactMessage,
        }),
      });
      if (response.ok) {
        setContactStatus('Message sent successfully!');
        setContactEmail('');
        setContactMessage('');
      } else {
        const data = await response.json();
        setContactStatus(data.message || 'Failed to send message.');
      }
    } catch (error) {
      setContactStatus('Failed to send message.');
    }
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary sticky-top text-uppercase shadow-lg py-3">
        <div className="container">
          <a href="/" className="navbar-brand">Gym & Fitness</a>
          <button className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#myNavbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="myNavbarNav">
            <ul className="navbar-nav mx-auto">
              <li className="nav-item mx-1">
                <a href="#about" className="nav-link">About</a>
              </li>
              <li className="nav-item mx-1">
                <a href="#service" className="nav-link">Service</a>
              </li>
              <li className="nav-item mx-1">
                <a href="#plan" className="nav-link">Plan</a>
              </li>
              <li className="nav-item mx-1">
                <a href="#testimonial" className="nav-link">Testimonial</a>
              </li>
              <li className="nav-item mx-1">
                <a href="#FAQ" className="nav-link">FAQ</a>
              </li>
              <li className="nav-item mx-1">
                <a href="#contact" className="nav-link">Contact</a>
              </li>
            </ul>

            <ul className="navbar-nav">
              <li className="nav-item mx-1">
                <a href="#LoginOffCanvas" className="nav-link" data-bs-toggle="offcanvas" role="button" aria-controls="offcanvasExample">Sign In</a>
              </li>
              <li className="nav-item mx-1">
                <a href="#RegisterOffCanvas" className="nav-link" data-bs-toggle="offcanvas" role="button" aria-controls="offcanvasExample">Sign Up</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div>
      {/* Header/Hero Section */}
      <header id="header">

        <div className="overlay"></div> {/* Background overlay */}
        
        <div className="container py-5">
          <h1 className="text-white" style={{ fontSize: '5rem' }} data-aos="fade-right" data-aos-duration="2000">
            BE FITNESS
          </h1>
          <h3 className="text-white" style={{ fontSize: '3rem' }} data-aos="fade-left" data-aos-duration="2000">
            & BE STRONG
          </h3>
          <p className="text-white" style={{ maxWidth: '500px' }} data-aos="fade-right" data-aos-duration="2000">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat rerum in praesentium, inventore porro architecto nobis corrupti ab dignissimos pariatur aperiam ea aliquid illo, fugiat perferendis necessitatibus voluptates culpa dolorem!
          </p>
          <button 
            className="btn fw-bold"
            style={{
              background: 'linear-gradient(135deg, #2ECC71 0%, #27AE60 100%)',
              color: '#F8F9FA',
              border: 'none',
              borderRadius: '25px',
              padding: '12px 30px',
              boxShadow: '0 5px 15px rgba(46, 204, 113, 0.3)',
              fontSize: '16px',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
            type="button" 
            data-bs-toggle="offcanvas" 
            data-bs-target="#RegisterOffCanvas" 
            aria-controls="offcanvasExample" 
            data-aos="fade-left" 
            data-aos-duration="2000"
          >
            <i className="fas fa-dumbbell me-2"></i>
            Join Us
          </button>
        </div>
      </header>

      {/* About Section */}
      <section id="about" className="container py-5">
        <div className="sub-heading text-center" data-aos="fade-left">ABOUT US</div>
        <div className="main-heading text-center" data-aos="fade-right">Who We Are</div>
        <div className="heading-line" data-aos="fade-left"></div>
        <div className="row align-items-center" data-aos="fade-up-right">
          <div className="col-md-6">
            <p className="text-white">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eos, consectetur odio corrupti quia laborum repellat praesentium modi illum aliquid debitis, rem adipisci similique nam ab ullam, officia quibusdam necessitatibus amet.</p>
            <p className="text-white">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eos, consectetur odio corrupti quia laborum repellat praesentium modi illum aliquid debitis, rem adipisci similique nam ab ullam, officia quibusdam necessitatibus amet.</p>
          </div>
          <div className="col-md-6" data-aos="fade-up-left">
            <img src="/img/about.jpg" alt="About us" className="img-fluid rounded-1" />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="service" className="container py-5">
        <div className="sub-heading text-center" data-aos="fade-left">Our Services</div>
        <div className="main-heading text-center" data-aos="fade-right">What We Offer</div>
        <div className="heading-line" data-aos="fade-left"></div>
        <div className="row">
          {/* Service 1 */}
          <div className="col-md-5" data-aos="fade-right">
            <img src="/img/service.png" alt="Service 1" className="img-fluid" style={{ maxHeight: '570px' }} />
          </div>
          <div className="col-md-7">
            <div 
              className="card service-card overflow-hidden my-2 p-3 border-0" 
              data-aos="fade-left"
              style={{
                background: 'linear-gradient(135deg, #F8F9FA 0%, #E9ECEF 100%)',
                borderRadius: '15px',
                boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                color: '#4A4A4A'
              }}
            >
              <div className="row">
                <div className="col-md-7 text-center">
                  <h5 style={{ color: '#343A40', fontWeight: 'bold' }}>Retail Merchandise</h5>
                  <p style={{ color: '#4A4A4A' }}>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Fugiat laborum numquam totam error sapiente ea, animi minus officia vel sed eaque fugit in, omnis, quam corporis voluptatibus laudantium veritatis consequuntur!</p>
                </div>
                <div className="col-md-5">
                  <img src="/img/about.jpg" alt="Retail Merchandise" className="border border-3" style={{ borderColor: '#2ECC71 !important', borderRadius: '10px' }} />
                </div>
              </div>
            </div>
            
            {/* Service 2 */}
            <div 
              className="card service-card overflow-hidden my-2 p-3 border-0" 
              data-aos="fade-left"
              style={{
                background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
                borderRadius: '15px',
                boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                color: '#4A4A4A'
              }}
            >
              <div className="row">
                <div className="col-md-7 text-center">
                  <h5 style={{ color: '#343A40', fontWeight: 'bold' }}>Online Personal Training</h5>
                  <p style={{ color: '#4A4A4A' }}>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Fugiat laborum numquam totam error sapiente ea, animi minus officia vel sed eaque fugit in, omnis, quam corporis voluptatibus laudantium veritatis consequuntur!</p>
                </div>
                <div className="col-md-5">
                  <img src="/img/card1.jpg" alt="Online Personal Training" className="border border-3" style={{ borderColor: '#38B6FF !important', borderRadius: '10px' }} />
                </div>
              </div>
            </div>
            
            {/* Service 3 */}
            <div 
              className="card service-card overflow-hidden my-2 p-3 border-0" 
              data-aos="fade-left"
              style={{
                background: 'linear-gradient(135deg, #E8F5E8 0%, #C8E6C9 100%)',
                borderRadius: '15px',
                boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                color: '#4A4A4A'
              }}
            >
              <div className="row">
                <div className="col-md-7 text-center">
                  <h5 style={{ color: '#343A40', fontWeight: 'bold' }}>Personal Training</h5>
                  <p style={{ color: '#4A4A4A' }}>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Fugiat laborum numquam totam error sapiente ea, animi minus officia vel sed eaque fugit in, omnis, quam corporis voluptatibus laudantium veritatis consequuntur!</p>
                </div>
                <div className="col-md-5">
                  <img src="/img/card2.jpg" alt="Personal Training" className="border border-3" style={{ borderColor: '#2ECC71 !important', borderRadius: '10px' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    <div>
      {/* Pricing Table */}
      <section id="plan" className="container py-5">
        <div className="sub-heading text-center" data-aos="fade-right">PRICING TABLE</div>
        <div className="main-heading text-center" data-aos="fade-left">Membership Plan</div>
        <div className="heading-line" data-aos="fade-right"></div>

        {plansLoading ? (
          <div className="d-flex justify-content-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading plans...</span>
            </div>
          </div>
        ) : (
          <div className="row align-items-center justify-content-center">
            {plans.map((plan, index) => (
              <div key={plan.id} className={`col-lg-4 col-md-6 mb-4`} data-aos={index === 1 ? "zoom-in" : index === 0 ? "fade-right" : "fade-left"}>
                <div 
                  className={`card text-center border-0 position-relative ${plan.is_recommended ? 'border border-3' : ''}`}
                  style={{
                    background: brightColors[index % brightColors.length],
                    minHeight: '450px',
                    borderRadius: '15px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                    transform: plan.is_recommended ? 'scale(1.05)' : 'scale(1)',
                    transition: 'all 0.3s ease',
                    borderColor: plan.is_recommended ? '#2ECC71' : 'transparent',
                    color: '#4A4A4A' // Using CSS text-color variable
                  }}
                >
                  {plan.is_recommended && (
                    <div 
                      className="position-absolute top-0 start-50 translate-middle"
                      style={{
                        background: '#2ECC71', // CSS fourth-color
                        padding: '5px 20px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        color: '#F8F9FA', // CSS third-color
                        zIndex: 10
                      }}
                    >
                      RECOMMENDED
                    </div>
                  )}
                  
                  <div className="card-header bg-transparent border-0 pt-4">
                    <h4 className="mb-0" style={{ color: '#343A40' }}>
                      $<span className="fs-1 fw-bold">{plan.price}</span>
                      <small className="fs-6">/{plan.duration === 1 ? 'day' : plan.duration === 3 ? '3 months' : plan.duration === 6 ? '6 months' : 'month'}</small>
                    </h4>
                  </div>
                  
                  <div 
                    className="alert mb-0"
                    style={{
                      background: 'rgba(52, 58, 64, 0.1)', // CSS dark-base with opacity
                      border: 'none',
                      color: '#343A40',
                      fontWeight: 'bold'
                    }}
                  >
                    {plan.title}
                  </div>
                  
                  <div className="card-body d-flex flex-column">
                    <p className="mb-4" style={{ fontSize: '14px', opacity: 0.8, color: '#4A4A4A' }}>
                      {plan.description || 'Complete fitness package with all gym facilities'}
                    </p>
                    
                    <ul className="list-group list-group-flush flex-grow-1">
                      <li className="list-group-item bg-transparent my-2 border-bottom" style={{ color: '#4A4A4A', borderColor: 'rgba(52, 58, 64, 0.2) !important' }}>
                        <i className="fas fa-check-circle me-2" style={{ color: '#2ECC71' }}></i>
                        Full Gym Access
                      </li>
                      <li className="list-group-item bg-transparent my-2 border-bottom" style={{ color: '#4A4A4A', borderColor: 'rgba(52, 58, 64, 0.2) !important' }}>
                        <i className="fas fa-check-circle me-2" style={{ color: '#2ECC71' }}></i>
                        Personal Training Sessions
                      </li>
                      <li className="list-group-item bg-transparent my-2 border-bottom" style={{ color: '#4A4A4A', borderColor: 'rgba(52, 58, 64, 0.2) !important' }}>
                        <i className="fas fa-check-circle me-2" style={{ color: '#2ECC71' }}></i>
                        Group Classes
                      </li>
                      <li className="list-group-item bg-transparent my-2 border-bottom" style={{ color: '#4A4A4A', borderColor: 'rgba(52, 58, 64, 0.2) !important' }}>
                        <i className="fas fa-check-circle me-2" style={{ color: '#2ECC71' }}></i>
                        Locker & Shower Access
                      </li>
                      <li className="list-group-item bg-transparent my-2 border-bottom" style={{ color: '#4A4A4A', borderColor: 'rgba(52, 58, 64, 0.2) !important' }}>
                        <i className="fas fa-check-circle me-2" style={{ color: '#2ECC71' }}></i>
                        Nutrition Consultation
                      </li>
                      
                      {plan.is_recommended && (
                        <li className="list-group-item bg-transparent p-0 border-0 mt-3">
                          <button 
                            className="btn w-100 fw-bold"
                            style={{
                              background: '#2ECC71', // CSS fourth-color
                              color: '#F8F9FA', // CSS third-color
                              border: 'none',
                              borderRadius: '25px',
                              padding: '12px 24px',
                              boxShadow: '0 5px 15px rgba(46, 204, 113, 0.3)'
                            }}
                            type="button" 
                            data-bs-toggle="offcanvas" 
                            data-bs-target="#RegisterOffCanvas" 
                            aria-controls="offcanvasExample"
                          >
                            <i className="fas fa-star me-2"></i>
                            SIGN UP NOW
                          </button>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Testimonial Section */}
      <section id="testimonial" className="container py-5">
        <div className="sub-heading text-center" data-aos="fade-right">TESTIMONIAL</div>
        <div className="main-heading text-center" data-aos="fade-left">What Our Clients Say</div>
        <div className="heading-line" data-aos="fade-right"></div>

        {/* Carousel for Testimonials */}
        <div id="carouselExampleIndicators" className="carousel slide">
          <div className="carousel-indicators">
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
          </div>

          <div className="carousel-inner">
            <div className="carousel-item active">
              <div className="row gy-2">
                {/* Testimonial 1 */}
                <div className="col-lg-6" data-aos="fade-right">
                  <div 
                    className="card border-0"
                    style={{
                      background: 'linear-gradient(135deg, #F8F9FA 0%, #E9ECEF 100%)',
                      borderRadius: '15px',
                      boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                      color: '#4A4A4A'
                    }}
                  >
                    <div className="row">
                      <div className="col-sm-7 py-3 px-4">
                        <h4 style={{ color: '#343A40' }}>Emma</h4>
                        <h6 style={{ color: '#2ECC71', fontWeight: 'bold' }}>CLIENT</h6>
                        <p style={{ color: '#4A4A4A' }}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti tempore animi reiciendis quam aliquid totam deserunt nam dolor nisi repellat.</p>
                        <div style={{ color: '#2ECC71' }}>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                        </div>
                      </div>
                      <div className="col-sm-5">
                        <img src="/img/testimonial1.jpg" alt="Testimonial Emma" className="img-fluid border border-3" style={{ borderColor: '#2ECC71', borderRadius: '10px' }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Testimonial 2 */}
                <div className="col-lg-6" data-aos="fade-left">
                  <div 
                    className="card border-0"
                    style={{
                      background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
                      borderRadius: '15px',
                      boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                      color: '#4A4A4A'
                    }}
                  >
                    <div className="row">
                      <div className="col-sm-7 py-3 px-4">
                        <h4 style={{ color: '#343A40' }}>Jennie</h4>
                        <h6 style={{ color: '#38B6FF', fontWeight: 'bold' }}>CLIENT</h6>
                        <p style={{ color: '#4A4A4A' }}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti tempore animi reiciendis quam aliquid totam deserunt nam dolor nisi repellat.</p>
                        <div style={{ color: '#38B6FF' }}>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                        </div>
                      </div>
                      <div className="col-sm-5">
                        <img src="/img/testimonial2.jpg" alt="Testimonial Jennie" className="img-fluid border border-3" style={{ borderColor: '#38B6FF', borderRadius: '10px' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Testimonial Carousel Items (Testimonial 3 and 4) */}
            <div className="carousel-item">
              <div className="row gy-2">
                {/* Testimonial 3 */}
                <div className="col-lg-6">
                  <div 
                    className="card border-0"
                    style={{
                      background: 'linear-gradient(135deg, #E8F5E8 0%, #C8E6C9 100%)',
                      borderRadius: '15px',
                      boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                      color: '#4A4A4A'
                    }}
                  >
                    <div className="row gy-2">
                      <div className="col-sm-7 py-3 px-4">
                        <h4 style={{ color: '#343A40' }}>Sara</h4>
                        <h6 style={{ color: '#2ECC71', fontWeight: 'bold' }}>CLIENT</h6>
                        <p style={{ color: '#4A4A4A' }}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti tempore animi reiciendis quam aliquid totam deserunt nam dolor nisi repellat.</p>
                        <div style={{ color: '#2ECC71' }}>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                        </div>
                      </div>
                      <div className="col-sm-5">
                        <img src="/img/testimonial3.jpg" alt="Testimonial Sara" className="img-fluid border border-3" style={{ borderColor: '#2ECC71', borderRadius: '10px' }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Testimonial 4 */}
                <div className="col-lg-6">
                  <div 
                    className="card border-0"
                    style={{
                      background: 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)',
                      borderRadius: '15px',
                      boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                      color: '#4A4A4A'
                    }}
                  >
                    <div className="row">
                      <div className="col-sm-7 py-3 px-4">
                        <h4 style={{ color: '#343A40' }}>Jiso</h4>
                        <h6 style={{ color: '#FF9800', fontWeight: 'bold' }}>CLIENT</h6>
                        <p style={{ color: '#4A4A4A' }}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti tempore animi reiciendis quam aliquid totam deserunt nam dolor nisi repellat.</p>
                        <div style={{ color: '#FF9800' }}>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                        </div>
                      </div>
                      <div className="col-sm-5">
                        <img src="/img/testimonial4.jpg" alt="Testimonial Jiso" className="img-fluid border border-3" style={{ borderColor: '#FF9800', borderRadius: '10px' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Carousel Controls */}
          <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>

          <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </section>

    </div>
    <div>
      {/* FAQ Section */}
      <section id="FAQ" className="container py-5">
        <div className="sub-heading text-center" data-aos="fade-left">FREQUENTLY ASKED QUESTION</div>
        <div className="main-heading text-center" data-aos="fade-right">FAQ</div>
        <div className="heading-line" data-aos="fade-left"></div>

        <div className="accordion" id="accordionExample" data-aos="zoom-in">
          {/* Accordion Item 1 */}
          <div className="accordion-item mb-2">
            <h2 className="accordion-header">
              <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                How to sign up?
              </button>
            </h2>
            <div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#accordionExample">
              <div className="accordion-body">
                <strong>This is the first item's accordion body.</strong> It is shown by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions.
              </div>
            </div>
          </div>

          {/* Accordion Item 2 */}
          <div className="accordion-item mb-2">
            <h2 className="accordion-header">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                Lorem ipsum dolor sit amet.
              </button>
            </h2>
            <div id="collapseTwo" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
              <div className="accordion-body">
                <strong>This is the second item's accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions.
              </div>
            </div>
          </div>

          {/* Accordion Item 3 */}
          <div className="accordion-item mb-2">
            <h2 className="accordion-header">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                Question #1
              </button>
            </h2>
            <div id="collapseThree" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
              <div className="accordion-body">
                <strong>This is the third item's accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions.
              </div>
            </div>
          </div>

          {/* Accordion Item 4 */}
          <div className="accordion-item mb-2">
            <h2 className="accordion-header">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                Question #2
              </button>
            </h2>
            <div id="collapseFour" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
              <div className="accordion-body">
                <strong>This is the fourth item's accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions.
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    <div>
      {/* Contact Section */}
      <section id="contact" className="container-fluid py-5">
        <div className="sub-heading text-center" data-aos="fade-right">CONTACT US</div>
        <div className="main-heading text-center" data-aos="fade-left">XX-XXXXXXXXX</div>
        <div className="heading-line" data-aos="fade-right"></div>

        <a 
          href="tel:+09426596565" 
          className="btn fw-bold"
          style={{
            background: 'linear-gradient(135deg, #2ECC71 0%, #27AE60 100%)',
            color: '#F8F9FA',
            border: 'none',
            borderRadius: '25px',
            padding: '12px 30px',
            boxShadow: '0 5px 15px rgba(46, 204, 113, 0.3)',
            fontSize: '16px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            textDecoration: 'none'
          }}
          data-aos="fade-left"
        >
          <i className="fas fa-phone me-2"></i>
          CALL US NOW
        </a>
      </section>

      {/* Footer Section */}
      <footer id="footer" className="container-fluid bg-dark text-white p-5">
        <div className="row gy-4">
          {/* Footer Column 1 */}
          <div className="col-md-4">
            <div className="footer-heading text-center">GYM & FITNESS</div>
            <div className="heading-line"></div>
            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Laboriosam, eum, vitae obcaecati consequatur ducimus esse tempore eaque unde reprehenderit deleniti, labore sapiente minus accusamus nobis facere officia laudantium nihil animi.</p>
            <div>
              <span>
                <button 
                  className="btn mx-1"
                  style={{
                    background: 'linear-gradient(135deg, #38B6FF 0%, #1E88E5 100%)',
                    color: '#F8F9FA',
                    border: '2px solid rgba(248, 249, 250, 0.3)',
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <i className="fa-brands fa-facebook fa-xl"></i>
                </button>
                <button 
                  className="btn mx-1"
                  style={{
                    background: 'linear-gradient(135deg, #38B6FF 0%, #00BCD4 100%)',
                    color: '#F8F9FA',
                    border: '2px solid rgba(248, 249, 250, 0.3)',
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <i className="fa-brands fa-twitter fa-xl"></i>
                </button>
                <button 
                  className="btn mx-1"
                  style={{
                    background: 'linear-gradient(135deg, #FF6B6B 0%, #D32F2F 100%)',
                    color: '#F8F9FA',
                    border: '2px solid rgba(248, 249, 250, 0.3)',
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <i className="fa-brands fa-youtube fa-xl"></i>
                </button>
                <button 
                  className="btn mx-1"
                  style={{
                    background: 'linear-gradient(135deg, #E91E63 0%, #AD1457 100%)',
                    color: '#F8F9FA',
                    border: '2px solid rgba(248, 249, 250, 0.3)',
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <i className="fa-brands fa-instagram fa-xl"></i>
                </button>
              </span>
            </div>
          </div>

          {/* Footer Column 2 */}
          <div className="col-md-4">
            <div className="footer-heading text-center">QUICK CONTACT</div>
            <div className="heading-line"></div>
            <ul>
              <li> <i className="fa-solid fa-location-dot fa-xl mx-2" style={{ color: '#2ECC71' }}></i> No.123, Hlaing St, Yangon, Burma</li>
              <li> <i className="fa-solid fa-phone fa-xl mx-2" style={{ color: '#38B6FF' }}></i> 09-426596565</li>
              <li> <i className="fa-solid fa-envelope fa-xl mx-2" style={{ color: '#FF9800' }}></i> hellfirewarrior123@gmail.com</li>
              <li> <i className="fa-solid fa-globe fa-xl mx-2" style={{ color: '#2ECC71' }}></i> www.gym&fitness.com</li>
            </ul>
          </div>

          {/* Footer Column 3 */}
          <div className="col-md-4">
            <div className="footer-heading text-center">SEND US MESSAGE</div>
            <div className="heading-line"></div>
            <form onSubmit={handleContactSubmit}>
              <div className="mb-3">
                <input 
                  type="email" 
                  className="form-control" 
                  placeholder="Your Email"
                  value={contactEmail}
                  onChange={e => setContactEmail(e.target.value)}
                  required
                  style={{
                    border: '2px solid #2ECC71',
                    borderRadius: '10px',
                    backgroundColor: '#F8F9FA',
                    color: '#343A40',
                    padding: '12px 15px'
                  }}
                />
              </div>
              <div className="mb-3">
                <textarea 
                  cols="30" 
                  rows="10" 
                  className="form-control" 
                  placeholder="Your Message"
                  value={contactMessage}
                  onChange={e => setContactMessage(e.target.value)}
                  required
                  style={{
                    border: '2px solid #2ECC71',
                    borderRadius: '10px',
                    backgroundColor: '#F8F9FA',
                    color: '#343A40',
                    padding: '12px 15px'
                  }}
                ></textarea>
              </div>
              <button 
                type="submit"
                className="btn fw-bold"
                style={{
                  background: 'linear-gradient(135deg, #2ECC71 0%, #27AE60 100%)',
                  color: '#F8F9FA',
                  border: 'none',
                  borderRadius: '25px',
                  padding: '12px 24px',
                  boxShadow: '0 5px 15px rgba(46, 204, 113, 0.3)'
                }}
              >
                <i className="fa-solid fa-paper-plane me-2"></i> Send
              </button>
              {contactStatus && (
                <div className="mt-3 text-center">
                  <span 
                    style={{ 
                      color: contactStatus.includes('successfully') ? '#2ECC71' : '#FF6B6B',
                      fontWeight: 'bold'
                    }}
                  >
                    {contactStatus}
                  </span>
                </div>
              )}
            </form>
          </div>
        </div>
      </footer>

      {/* Copyright Section */}
      <section id="copyright" className="container-fluid bg-dark text-white px-5 py-2">
        <p className="text-center">&copy; <script>document.write(new Date().getFullYear());</script> Copyright & all right reserved</p>
      </section>

      {/* Up Arrow Button */}
      <a 
        href="#header" 
        className="btn up-arrow"
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #007BFF 0%, #38B6FF 100%)',
          color: '#F8F9FA',
          border: '2px solid rgba(248, 249, 250, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          textDecoration: 'none',
          boxShadow: '0 5px 15px rgba(0, 123, 255, 0.3)',
          transition: 'all 0.3s ease',
          zIndex: 1000
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'translateY(-3px)';
          e.target.style.boxShadow = '0 8px 25px rgba(0, 123, 255, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 5px 15px rgba(0, 123, 255, 0.3)';
        }}
      >
        <i className="fa-solid fa-arrow-up"></i>
      </a>

      {/* OffCanvas for Sign In */}
      <div className="offcanvas offcanvas-end" tabindex="-1" id="LoginOffCanvas" aria-labelledby="offcanvasExampleLabel" style={{ backgroundColor: '#F8F9FA' }}>
        <div className="offcanvas-header" style={{ borderBottom: '2px solid #2ECC71' }}>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body">
          <div className="sub-heading text-center" style={{ color: '#2ECC71', fontWeight: 'bold' }}>LOGIN FORM</div>
          <div className="heading-line" style={{ backgroundColor: '#2ECC71', margin: '10px auto 30px auto' }}></div>

          <form onSubmit={handleLoginSubmit}>
            <div className="mb-3">
              <label style={{ color: '#343A40', fontWeight: 'bold' }}>Email</label>
              <input
                type="email"
                className="form-control"
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
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
              <label style={{ color: '#343A40', fontWeight: 'bold' }}>Password</label>
              <input
                type="password"
                className="form-control"
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
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
            <button 
              className="btn fw-bold float-end"
              style={{
                background: 'linear-gradient(135deg, #2ECC71 0%, #27AE60 100%)',
                color: '#F8F9FA',
                border: 'none',
                borderRadius: '25px',
                padding: '12px 24px',
                boxShadow: '0 5px 15px rgba(46, 204, 113, 0.3)'
              }}
            >
              <i className="fa-solid fa-paper-plane me-2"></i> Sign In
            </button>
            {loginStatus && (
              <div className="mt-2">
                <span 
                  style={{ 
                    color: loginStatus.includes('successful') ? '#2ECC71' : '#FF6B6B',
                    fontWeight: 'bold'
                  }}
                >
                  {loginStatus}
                </span>
              </div>
            )}
          </form>
        </div>
      </div>
      
      {/* OffCanvas for Sign Up */}
      <div className="offcanvas offcanvas-end" tabindex="-1" id="RegisterOffCanvas" aria-labelledby="offcanvasExampleLabel" style={{ backgroundColor: '#F8F9FA' }}>
        <div className="offcanvas-header" style={{ borderBottom: '2px solid #38B6FF' }}>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body">
          <div className="sub-heading text-center" style={{ color: '#38B6FF', fontWeight: 'bold' }}>REGISTRATION FORM</div>
          <div className="heading-line" style={{ backgroundColor: '#38B6FF', margin: '10px auto 30px auto' }}></div>

          <form onSubmit={handleSignupSubmit}>
            <div className="mb-3">
              <label style={{ color: '#343A40', fontWeight: 'bold' }}>Name</label>
              <input
                type="text"
                className="form-control"
                value={signupName}
                onChange={e => setSignupName(e.target.value)}
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
              <label style={{ color: '#343A40', fontWeight: 'bold' }}>Email</label>
              <input
                type="email"
                className="form-control"
                value={signupEmail}
                onChange={e => setSignupEmail(e.target.value)}
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
              <label style={{ color: '#343A40', fontWeight: 'bold' }}>Password</label>
              <input
                type="password"
                className="form-control"
                value={signupPassword}
                onChange={e => setSignupPassword(e.target.value)}
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
              <label style={{ color: '#343A40', fontWeight: 'bold' }}>Confirm Password</label>
              <input
                type="password"
                className="form-control"
                value={signupConfirmPassword}
                onChange={e => setSignupConfirmPassword(e.target.value)}
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
            <button 
              className="btn fw-bold float-end"
              style={{
                background: 'linear-gradient(135deg, #38B6FF 0%, #1E88E5 100%)',
                color: '#F8F9FA',
                border: 'none',
                borderRadius: '25px',
                padding: '12px 24px',
                boxShadow: '0 5px 15px rgba(56, 182, 255, 0.3)'
              }}
            >
              <i className="fa-solid fa-paper-plane me-2"></i> Sign Up
            </button>
            {signupStatus && (
              <div className="mt-2">
                <span 
                  style={{ 
                    color: signupStatus.includes('successful') ? '#2ECC71' : '#FF6B6B',
                    fontWeight: 'bold'
                  }}
                >
                  {signupStatus}
                </span>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Bootstrap JS Links */}
      <script src="js/bootstrap.bundle.min.js"></script>

      {/* Animate on Scroll library (AOS) JS Link */}
      <script src="aos/dist/aos.js"></script>

      <script>
        AOS.init();
      </script>
    </div>
    </div>
  );
};

export default HomePage;

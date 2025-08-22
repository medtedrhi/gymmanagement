import React, { useState } from 'react';
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
                <a href="#news" className="nav-link">News</a>
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
          <button className="btn btn-danger" type="button" data-bs-toggle="offcanvas" data-bs-target="#RegisterOffCanvas" aria-controls="offcanvasExample" data-aos="fade-left" data-aos-duration="2000">
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
            <div className="card service-card overflow-hidden bg-dark my-2 p-3" data-aos="fade-left">
              <div className="row">
                <div className="col-md-7 text-center text-white">
                  <h5>Retail Merchandise</h5>
                  <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Fugiat laborum numquam totam error sapiente ea, animi minus officia vel sed eaque fugit in, omnis, quam corporis voluptatibus laudantium veritatis consequuntur!</p>
                </div>
                <div className="col-md-5">
                  <img src="/img/about.jpg" alt="Retail Merchandise" className="border border-3 border-danger" />
                </div>
              </div>
            </div>
            
            {/* Service 2 */}
            <div className="card service-card overflow-hidden bg-dark my-2 p-3" data-aos="fade-left">
              <div className="row">
                <div className="col-md-7 text-center text-white">
                  <h5>Online Personal Training</h5>
                  <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Fugiat laborum numquam totam error sapiente ea, animi minus officia vel sed eaque fugit in, omnis, quam corporis voluptatibus laudantium veritatis consequuntur!</p>
                </div>
                <div className="col-md-5">
                  <img src="/img/card1.jpg" alt="Online Personal Training" className="border border-3 border-danger" />
                </div>
              </div>
            </div>
            
            {/* Service 3 */}
            <div className="card service-card overflow-hidden bg-dark my-2 p-3" data-aos="fade-left">
              <div className="row">
                <div className="col-md-7 text-center text-white">
                  <h5>Personal Training</h5>
                  <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Fugiat laborum numquam totam error sapiente ea, animi minus officia vel sed eaque fugit in, omnis, quam corporis voluptatibus laudantium veritatis consequuntur!</p>
                </div>
                <div className="col-md-5">
                  <img src="/img/card2.jpg" alt="Personal Training" className="border border-3 border-danger" />
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

        <div className="row align-items-center">
          {/* Plan 1 */}
          <div className="col-lg-4 col-md-6" data-aos="fade-right">
            <div className="card text-center text-bg-dark border-0">
              <div className="card-header">
                <h4>$<span className="fs-1">10</span>/day</h4>
              </div>
              <div className="alert bg-warning rounded-0">
                One Day Training
              </div>
              <div className="card-body">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item bg-transparent text-light my-2 border-bottom">An item</li>
                  <li className="list-group-item bg-transparent text-light my-2 border-bottom">A second item</li>
                  <li className="list-group-item bg-transparent text-light my-2 border-bottom">A third item</li>
                  <li className="list-group-item bg-transparent text-light my-2 border-bottom">A fourth item</li>
                  <li className="list-group-item bg-transparent text-light my-2 border-bottom">And a fifth one</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Plan 2 - Recommended */}
          <div className="col-lg-4 col-md-6" data-aos="zoom-in">
            <div className="card text-center text-bg-dark border border-3 border-danger plan-2-card">
              <div className="card-header">
                <h4>$<span className="fs-1">79</span>/month</h4>
              </div>
              <div className="alert bg-danger rounded-0">
                12 Months Membership
              </div>
              <div className="recommended">Recommended</div>
              <div className="card-body">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item bg-transparent text-light my-2 border-bottom">An item</li>
                  <li className="list-group-item bg-transparent text-light my-2 border-bottom">A second item</li>
                  <li className="list-group-item bg-transparent text-light my-2 border-bottom">A third item</li>
                  <li className="list-group-item bg-transparent text-light my-2 border-bottom">A fourth item</li>
                  <li className="list-group-item bg-transparent text-light my-2 border-bottom">And a fifth one</li>
                  <button className="btn btn-danger my-2" type="button" data-bs-toggle="offcanvas" data-bs-target="#RegisterOffCanvas" aria-controls="offcanvasExample">
                    SIGN UP NOW
                  </button>
                </ul>
              </div>
            </div>
          </div>

          {/* Plan 3 */}
          <div className="col-lg-4 col-md-6" data-aos="fade-left">
            <div className="card text-center text-bg-dark border-0">
              <div className="card-header">
                <h4>$<span className="fs-1">99</span>/month</h4>
              </div>
              <div className="alert bg-warning rounded-0">
                Monthly Payment
              </div>
              <div className="card-body">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item bg-transparent text-light my-2 border-bottom">An item</li>
                  <li className="list-group-item bg-transparent text-light my-2 border-bottom">A second item</li>
                  <li className="list-group-item bg-transparent text-light my-2 border-bottom">A third item</li>
                  <li className="list-group-item bg-transparent text-light my-2 border-bottom">A fourth item</li>
                  <li className="list-group-item bg-transparent text-light my-2 border-bottom">And a fifth one</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
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
                  <div className="card text-bg-dark border-0">
                    <div className="row">
                      <div className="col-sm-7 py-3 px-4">
                        <h4 className="text-white">Emma</h4>
                        <h6 className="text-warning">CLIENT</h6>
                        <p className="text-white">Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti tempore animi reiciendis quam aliquid totam deserunt nam dolor nisi repellat.</p>
                        <div className="text-warning">
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                        </div>
                      </div>
                      <div className="col-sm-5">
                        <img src="/img/testimonial1.jpg" alt="Testimonial Emma" className="img-fluid rounded-1" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Testimonial 2 */}
                <div className="col-lg-6" data-aos="fade-left">
                  <div className="card text-bg-dark border-0">
                    <div className="row">
                      <div className="col-sm-7 py-3 px-4">
                        <h4 className="text-white">Jennie</h4>
                        <h6 className="text-warning">CLIENT</h6>
                        <p className="text-white">Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti tempore animi reiciendis quam aliquid totam deserunt nam dolor nisi repellat.</p>
                        <div className="text-warning">
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                        </div>
                      </div>
                      <div className="col-sm-5">
                        <img src="/img/testimonial2.jpg" alt="Testimonial Jennie" className="img-fluid rounded-1" />
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
                  <div className="card text-bg-dark border-0">
                    <div className="row gy-2">
                      <div className="col-sm-7 py-3 px-4">
                        <h4 className="text-white">Sara</h4>
                        <h6 className="text-warning">CLIENT</h6>
                        <p className="text-white">Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti tempore animi reiciendis quam aliquid totam deserunt nam dolor nisi repellat.</p>
                        <div className="text-warning">
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                        </div>
                      </div>
                      <div className="col-sm-5">
                        <img src="/img/testimonial3.jpg" alt="Testimonial Sara" className="img-fluid rounded-1" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Testimonial 4 */}
                <div className="col-lg-6">
                  <div className="card text-bg-dark border-0">
                    <div className="row">
                      <div className="col-sm-7 py-3 px-4">
                        <h4 className="text-white">Jiso</h4>
                        <h6 className="text-warning">CLIENT</h6>
                        <p className="text-white">Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti tempore animi reiciendis quam aliquid totam deserunt nam dolor nisi repellat.</p>
                        <div className="text-warning">
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                        </div>
                      </div>
                      <div className="col-sm-5">
                        <img src="/img/testimonial4.jpg" alt="Testimonial Jiso" className="img-fluid rounded-1" />
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
      {/* Recent News Section */}
      <section id="news" className="container py-5">
        <div className="sub-heading text-center" data-aos="fade-left">RECENT BLOGS</div>
        <div className="main-heading text-center" data-aos="fade-right">Our Latest News</div>
        <div className="heading-line" data-aos="fade-left"></div>

        <div className="row gy-2">
          {/* Blog Post 1 */}
          <div className="col-md-6 col-lg-4" data-aos="fade-right">
            <div className="card text-bg-dark p-2">
              <div className="card-header">
                <img src="/img/new1.jpeg" alt="Blog 1" className="img-fluid border border-3 border-danger" />
              </div>
              <div className="card-body">
                <h6 className="text-warning">BLOG CATEGORY ONE</h6>
                <h5>How to fit your body</h5>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit unde a saepe. Omnis, eum adipisci ad suscipit, pariatur cumque eos necessitatibus quo sunt culpa exercitationem iusto, aliquam veniam fugiat placeat?</p>
                <div>
                  <span className="float-start">
                    <i className="fa-solid fa-timer"></i> 13m | Sara
                  </span>
                  <span className="float-end">
                    <i className="fa-regular fa-comment"></i> 52
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Blog Post 2 */}
          <div className="col-md-6 col-lg-4" data-aos="zoom-in">
            <div className="card text-bg-dark p-2">
              <div className="card-header">
                <img src="/img/new2.jpg" alt="Blog 2" className="img-fluid border border-3 border-danger" />
              </div>
              <div className="card-body">
                <h6 className="text-warning">BLOG CATEGORY TWO</h6>
                <h5>Be Working Out Daily</h5>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit unde a saepe. Omnis, eum adipisci ad suscipit, pariatur cumque eos necessitatibus quo sunt culpa exercitationem iusto, aliquam veniam fugiat placeat?</p>
                <div>
                  <span className="float-start">
                    <i className="fa-solid fa-timer"></i> 13m | Sara
                  </span>
                  <span className="float-end">
                    <i className="fa-regular fa-comment"></i> 52
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Blog Post 3 */}
          <div className="col-md-6 col-lg-4" data-aos="fade-left">
            <div className="card text-bg-dark p-2">
              <div className="card-header">
                <img src="/img/new3.jpeg" alt="Blog 3" className="img-fluid border border-3 border-danger" />
              </div>
              <div className="card-body">
                <h6 className="text-warning">BLOG CATEGORY THREE</h6>
                <h5>For ABS People</h5>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit unde a saepe. Omnis, eum adipisci ad suscipit, pariatur cumque eos necessitatibus quo sunt culpa exercitationem iusto, aliquam veniam fugiat placeat?</p>
                <div>
                  <span className="float-start">
                    <i className="fa-solid fa-timer"></i> 13m | Sara
                  </span>
                  <span className="float-end">
                    <i className="fa-regular fa-comment"></i> 52
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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

        <a href="tel:+09426596565" className="btn btn-danger" data-aos="fade-left">CALL US NOW</a>
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
                <a href="#" className="btn btn-outline-danger text-white mx-1"><i className="fa-brands fa-facebook fa-xl"></i></a>
                <a href="#" className="btn btn-outline-danger text-white mx-1"><i className="fa-brands fa-twitter fa-xl"></i></a>
                <a href="#" className="btn btn-outline-danger text-white mx-1"><i className="fa-brands fa-youtube fa-xl"></i></a>
                <a href="#" className="btn btn-outline-danger text-white mx-1"><i className="fa-brands fa-instagram fa-xl"></i></a>
              </span>
            </div>
          </div>

          {/* Footer Column 2 */}
          <div className="col-md-4">
            <div className="footer-heading text-center">QUICK CONTACT</div>
            <div className="heading-line"></div>
            <ul>
              <li> <i className="fa-solid fa-location-dot text-danger fa-xl mx-2"></i> No.123, Hlaing St, Yangon, Burma</li>
              <li> <i className="fa-solid fa-phone text-danger fa-xl mx-2"></i> 09-426596565</li>
              <li> <i className="fa-solid fa-envelope text-danger fa-xl mx-2"></i> hellfirewarrior123@gmail.com</li>
              <li> <i className="fa-solid fa-globe text-danger fa-xl mx-2"></i><a href="#"> www.gym&fitness.com</a></li>
            </ul>
          </div>

          {/* Footer Column 3 */}
          <div className="col-md-4">
            <div className="footer-heading text-center">SEND US MESSAGE</div>
            <div className="heading-line"></div>
            <form action="">
              <div className="mb-3">
                <input type="email" className="form-control border border-danger" placeholder="Your Email" />
              </div>
              <div className="mb-3">
                <textarea name="" id="" cols="30" rows="10" className="form-control border border-danger" placeholder="Your Message"></textarea>
              </div>
              <button className="btn btn-danger"><i className="fa-solid fa-paper-plane"></i> Send</button>
            </form>
          </div>
        </div>
      </footer>

      {/* Copyright Section */}
      <section id="copyright" className="container-fluid bg-dark text-white px-5 py-2">
        <p className="text-center">&copy; <script>document.write(new Date().getFullYear());</script> Copyright & all right reserved</p>
      </section>

      {/* Up Arrow Button */}
      <a href="#navigation" className="btn btn-danger up-arrow"><i className="fa-solid fa-arrow-up"></i></a>

      {/* OffCanvas for Sign In */}
      <div className="offcanvas offcanvas-end" tabindex="-1" id="LoginOffCanvas" aria-labelledby="offcanvasExampleLabel">
        <div className="offcanvas-header">
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body">
          <div className="sub-heading text-center text-danger">LOGIN FORM</div>
          <div className="heading-line"></div>

          <form onSubmit={handleLoginSubmit}>
            <div className="mb-3">
              <label>Email</label>
              <input
                type="email"
                className="form-control border border-danger"
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label>Password</label>
              <input
                type="password"
                className="form-control border border-danger"
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                required
              />
            </div>
            <button className="btn btn-danger float-end"><i className="fa-solid fa-paper-plane"></i> Sign In</button>
            {loginStatus && <div className="mt-2">{loginStatus}</div>}
          </form>
        </div>
      </div>
      
      {/* OffCanvas for Sign Up */}
      <div className="offcanvas offcanvas-end" tabindex="-1" id="RegisterOffCanvas" aria-labelledby="offcanvasExampleLabel">
        <div className="offcanvas-header">
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body">
          <div className="sub-heading text-center text-danger">REGISTRATION FORM</div>
          <div className="heading-line"></div>

          <form onSubmit={handleSignupSubmit}>
            <div className="mb-3">
              <label>Name</label>
              <input
                type="text"
                className="form-control border border-danger"
                value={signupName}
                onChange={e => setSignupName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label>Email</label>
              <input
                type="email"
                className="form-control border border-danger"
                value={signupEmail}
                onChange={e => setSignupEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label>Password</label>
              <input
                type="password"
                className="form-control border border-danger"
                value={signupPassword}
                onChange={e => setSignupPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label>Confirm Password</label>
              <input
                type="password"
                className="form-control border border-danger"
                value={signupConfirmPassword}
                onChange={e => setSignupConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button className="btn btn-danger float-end"><i className="fa-solid fa-paper-plane"></i> Sign Up</button>
            {signupStatus && <div className="mt-2">{signupStatus}</div>}
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

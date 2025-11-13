import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../Assets/styles/login.css';
import logo from '../Assets/Images/ML_Logo-w-tag-vector.svg';

const Register = () => {
    const [formData, setFormData] = useState({
        companyName: '',
        firstName: '',
        lastName: '',
        phone: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        country: ''
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const passwordRequirements = [
        { text: 'Eight characters minimum', test: (pwd) => pwd.length >= 8 },
        { text: 'One lowercase letter', test: (pwd) => /[a-z]/.test(pwd) },
        { text: 'One uppercase letter', test: (pwd) => /[A-Z]/.test(pwd) },
        { text: 'One number', test: (pwd) => /\d/.test(pwd) },
        { text: 'One special character', test: (pwd) => /[@$!%*?&]/.test(pwd) }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.companyName.trim()) {
            newErrors.companyName = 'Company name is required';
        }

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        }

        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        } else if (formData.username.length < 3 || formData.username.length > 24) {
            newErrors.username = 'Username must be between 3-24 characters';
        } else if (!/^[a-z0-9]+$/.test(formData.username)) {
            newErrors.username = 'Only lowercase letters and numbers are allowed';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(formData.password)) {
            newErrors.password = 'Password must meet all requirements';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (!formData.country.trim()) {
            newErrors.country = 'Country is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    /*const handleSubmit = (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            // Here you would typically make an API call to register the user
            console.log('Registration data:', formData);
            
            // For now, just navigate to login page
            navigate('/');
        }
    }; */
    const handleSubmit = async (e) => {
  e.preventDefault();

  if (validateForm()) {
    try {
      const response = await fetch(`https://mighty-lube.com/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          emailAddress: formData.email,
          phoneNumber: formData.phone,
          companyName: formData.companyName,
          country: formData.country,
        }),
      });

      if (response.status === 201) {
        const responseData = await response.json();

        // store sessionID like Dart's SharedPreferences
        localStorage.setItem("sessionID", responseData.sessionID);

        console.log("Registration successful:", responseData);
        navigate("/"); // redirect to login or dashboard
      } else {
        const errorText = await response.text();
        console.error("Account creation failed:", errorText);
        setErrors((prev) => ({ ...prev, api: "Registration failed." }));
      }
    } catch (e) {
      console.error("Error:", e);
      setErrors((prev) => ({ ...prev, api: "Network or server error." }));
    }
  }
};

    return (
      <div className="login-page">
        {/* Top header bar */}
        <div className="login-header">
          <div className="header-inner">
            <img src={logo} alt="Mighty Lube Logo" className="header-logo" />
            <nav className="header-nav">
              <a href="#account" className="header-link">
                MY ACCOUNT
              </a>
              <a href="#application" className="header-link">
                APPLICATION
              </a>
              <span className="header-lock" aria-hidden>
                🔒
              </span>
            </nav>
          </div>
        </div>

        {/* Main content */}
        <div className="login-content">
          <div className="register-container">
            <h1 className="register-title">Create Your Account</h1>

            <form onSubmit={handleSubmit} className="register-form">
              <div className="form-row">
                <label htmlFor="companyName">Company Name *</label>
                <input
                  id="companyName"
                  name="companyName"
                  type="text"
                  value={formData.companyName}
                  onChange={handleChange}
                  className={errors.companyName ? "error" : ""}
                />
                {errors.companyName && (
                  <span className="error-message">{errors.companyName}</span>
                )}
              </div>

              <div className="form-row">
                <label htmlFor="firstName">First Name *</label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={errors.firstName ? "error" : ""}
                />
                {errors.firstName && (
                  <span className="error-message">{errors.firstName}</span>
                )}
              </div>

              <div className="form-row">
                <label htmlFor="lastName">Last Name *</label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={errors.lastName ? "error" : ""}
                />
                {errors.lastName && (
                  <span className="error-message">{errors.lastName}</span>
                )}
              </div>

              <div className="form-row">
                <label htmlFor="phone">Phone *</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className={errors.phone ? "error" : ""}
                />
                {errors.phone && (
                  <span className="error-message">{errors.phone}</span>
                )}
              </div>

              <div className="form-row">
                <label htmlFor="username">Username *</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  className={errors.username ? "error" : ""}
                />
                <p className="field-hint">
                  Only lower case letters (a-z) and numbers (0-9) are allowed.
                  Username must be between 3-24 characters.
                </p>
                {errors.username && (
                  <span className="error-message">{errors.username}</span>
                )}
              </div>

              <div className="form-row">
                <label htmlFor="email">Email Address *</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? "error" : ""}
                />
                {errors.email && (
                  <span className="error-message">{errors.email}</span>
                )}
              </div>

              <div className="form-row">
                <label htmlFor="password">Password *</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? "error" : ""}
                />
                {formData.password && (
                  <ul className="pwd-reqs">
                    {passwordRequirements.map((rule) => (
                      <li
                        key={rule.text}
                        className={
                          rule.test(formData.password) ? "met" : "unmet"
                        }
                      >
                        ⦿ {rule.text}
                      </li>
                    ))}
                  </ul>
                )}
                {errors.password && (
                  <span className="error-message">{errors.password}</span>
                )}
              </div>

              <div className="form-row">
                <label htmlFor="confirmPassword">Confirm Password *</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={errors.confirmPassword ? "error" : ""}
                />
                {errors.confirmPassword && (
                  <span className="error-message">
                    {errors.confirmPassword}
                  </span>
                )}
              </div>

              <div className="form-row">
                <label htmlFor="country">Country *</label>
                <select 
                  id="country" 
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className={errors.country ? "error" : ""}
                >
                  <option value="">Select a country</option>
                  <option value="Afghanistan">Afghanistan</option>
                  <option value="Albania">Albania</option>
                  <option value="Algeria">Algeria</option>
                  <option value="Andorra">Andorra</option>
                  <option value="Angola">Angola</option>
                  <option value="Antigua and Barbuda">Antigua and Barbuda</option>
                  <option value="Argentina">Argentina</option>
                  <option value="Armenia">Armenia</option>
                  <option value="Australia">Australia</option>
                  <option value="Austria">Austria</option>
                  <option value="Azerbaijan">Azerbaijan</option>
                  <option value="Bahamas">Bahamas</option>
                  <option value="Bahrain">Bahrain</option>
                  <option value="Bangladesh">Bangladesh</option>
                  <option value="Barbados">Barbados</option>
                  <option value="Belarus">Belarus</option>
                  <option value="Belgium">Belgium</option>
                  <option value="Belize">Belize</option>
                  <option value="Benin">Benin</option>
                  <option value="Bhutan">Bhutan</option>
                  <option value="Bolivia">Bolivia</option>
                  <option value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>
                  <option value="Botswana">Botswana</option>
                  <option value="Brazil">Brazil</option>
                  <option value="Brunei">Brunei</option>
                  <option value="Bulgaria">Bulgaria</option>
                  <option value="Burkina Faso">Burkina Faso</option>
                  <option value="Burundi">Burundi</option>
                  <option value="Cambodia">Cambodia</option>
                  <option value="Cameroon">Cameroon</option>
                  <option value="Canada">Canada</option>
                  <option value="Cape Verde">Cape Verde</option>
                  <option value="Central African Republic">Central African Republic</option>
                  <option value="Chad">Chad</option>
                  <option value="Chile">Chile</option>
                  <option value="China">China</option>
                  <option value="Colombia">Colombia</option>
                  <option value="Comoros">Comoros</option>
                  <option value="Congo">Congo</option>
                  <option value="Costa Rica">Costa Rica</option>
                  <option value="Croatia">Croatia</option>
                  <option value="Cuba">Cuba</option>
                  <option value="Cyprus">Cyprus</option>
                  <option value="Czech Republic">Czech Republic</option>
                  <option value="Denmark">Denmark</option>
                  <option value="Djibouti">Djibouti</option>
                  <option value="Dominica">Dominica</option>
                  <option value="Dominican Republic">Dominican Republic</option>
                  <option value="East Timor">East Timor</option>
                  <option value="Ecuador">Ecuador</option>
                  <option value="Egypt">Egypt</option>
                  <option value="El Salvador">El Salvador</option>
                  <option value="Equatorial Guinea">Equatorial Guinea</option>
                  <option value="Eritrea">Eritrea</option>
                  <option value="Estonia">Estonia</option>
                  <option value="Ethiopia">Ethiopia</option>
                  <option value="Fiji">Fiji</option>
                  <option value="Finland">Finland</option>
                  <option value="France">France</option>
                  <option value="Gabon">Gabon</option>
                  <option value="Gambia">Gambia</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Germany">Germany</option>
                  <option value="Ghana">Ghana</option>
                  <option value="Greece">Greece</option>
                  <option value="Grenada">Grenada</option>
                  <option value="Guatemala">Guatemala</option>
                  <option value="Guinea">Guinea</option>
                  <option value="Guinea-Bissau">Guinea-Bissau</option>
                  <option value="Guyana">Guyana</option>
                  <option value="Haiti">Haiti</option>
                  <option value="Honduras">Honduras</option>
                  <option value="Hungary">Hungary</option>
                  <option value="Iceland">Iceland</option>
                  <option value="India">India</option>
                  <option value="Indonesia">Indonesia</option>
                  <option value="Iran">Iran</option>
                  <option value="Iraq">Iraq</option>
                  <option value="Ireland">Ireland</option>
                  <option value="Israel">Israel</option>
                  <option value="Italy">Italy</option>
                  <option value="Ivory Coast">Ivory Coast</option>
                  <option value="Jamaica">Jamaica</option>
                  <option value="Japan">Japan</option>
                  <option value="Jordan">Jordan</option>
                  <option value="Kazakhstan">Kazakhstan</option>
                  <option value="Kenya">Kenya</option>
                  <option value="Kiribati">Kiribati</option>
                  <option value="Korea North">Korea North</option>
                  <option value="Korea South">Korea South</option>
                  <option value="Kosovo">Kosovo</option>
                  <option value="Kuwait">Kuwait</option>
                  <option value="Kyrgyzstan">Kyrgyzstan</option>
                  <option value="Laos">Laos</option>
                  <option value="Latvia">Latvia</option>
                  <option value="Lebanon">Lebanon</option>
                  <option value="Lesotho">Lesotho</option>
                  <option value="Liberia">Liberia</option>
                  <option value="Libya">Libya</option>
                  <option value="Liechtenstein">Liechtenstein</option>
                  <option value="Lithuania">Lithuania</option>
                  <option value="Luxembourg">Luxembourg</option>
                  <option value="Macedonia">Macedonia</option>
                  <option value="Madagascar">Madagascar</option>
                  <option value="Malawi">Malawi</option>
                  <option value="Malaysia">Malaysia</option>
                  <option value="Maldives">Maldives</option>
                  <option value="Mali">Mali</option>
                  <option value="Malta">Malta</option>
                  <option value="Marshall Islands">Marshall Islands</option>
                  <option value="Mauritania">Mauritania</option>
                  <option value="Mauritius">Mauritius</option>
                  <option value="Mexico">Mexico</option>
                  <option value="Micronesia">Micronesia</option>
                  <option value="Moldova">Moldova</option>
                  <option value="Monaco">Monaco</option>
                  <option value="Mongolia">Mongolia</option>
                  <option value="Montenegro">Montenegro</option>
                  <option value="Morocco">Morocco</option>
                  <option value="Mozambique">Mozambique</option>
                  <option value="Myanmar">Myanmar</option>
                  <option value="Namibia">Namibia</option>
                  <option value="Nauru">Nauru</option>
                  <option value="Nepal">Nepal</option>
                  <option value="Netherlands">Netherlands</option>
                  <option value="New Zealand">New Zealand</option>
                  <option value="Nicaragua">Nicaragua</option>
                  <option value="Niger">Niger</option>
                  <option value="Nigeria">Nigeria</option>
                  <option value="Norway">Norway</option>
                  <option value="Oman">Oman</option>
                  <option value="Pakistan">Pakistan</option>
                  <option value="Palau">Palau</option>
                  <option value="Panama">Panama</option>
                  <option value="Papua New Guinea">Papua New Guinea</option>
                  <option value="Paraguay">Paraguay</option>
                  <option value="Peru">Peru</option>
                  <option value="Philippines">Philippines</option>
                  <option value="Poland">Poland</option>
                  <option value="Portugal">Portugal</option>
                  <option value="Qatar">Qatar</option>
                  <option value="Romania">Romania</option>
                  <option value="Russian Federation">Russian Federation</option>
                  <option value="Rwanda">Rwanda</option>
                  <option value="Saint Kitts and Nevis">Saint Kitts and Nevis</option>
                  <option value="Saint Lucia">Saint Lucia</option>
                  <option value="Saint Vincent and the Grenadines">Saint Vincent and the Grenadines</option>
                  <option value="Samoa">Samoa</option>
                  <option value="San Marino">San Marino</option>
                  <option value="Sao Tome and Principe">Sao Tome and Principe</option>
                  <option value="Saudi Arabia">Saudi Arabia</option>
                  <option value="Senegal">Senegal</option>
                  <option value="Serbia">Serbia</option>
                  <option value="Seychelles">Seychelles</option>
                  <option value="Sierra Leone">Sierra Leone</option>
                  <option value="Singapore">Singapore</option>
                  <option value="Slovakia">Slovakia</option>
                  <option value="Slovenia">Slovenia</option>
                  <option value="Solomon Islands">Solomon Islands</option>
                  <option value="Somalia">Somalia</option>
                  <option value="South Africa">South Africa</option>
                  <option value="South Sudan">South Sudan</option>
                  <option value="Spain">Spain</option>
                  <option value="Sri Lanka">Sri Lanka</option>
                  <option value="Sudan">Sudan</option>
                  <option value="Suriname">Suriname</option>
                  <option value="Swaziland">Swaziland</option>
                  <option value="Sweden">Sweden</option>
                  <option value="Switzerland">Switzerland</option>
                  <option value="Syria">Syria</option>
                  <option value="Taiwan">Taiwan</option>
                  <option value="Tajikistan">Tajikistan</option>
                  <option value="Tanzania">Tanzania</option>
                  <option value="Thailand">Thailand</option>
                  <option value="Togo">Togo</option>
                  <option value="Tonga">Tonga</option>
                  <option value="Trinidad and Tobago">Trinidad and Tobago</option>
                  <option value="Tunisia">Tunisia</option>
                  <option value="Turkey">Turkey</option>
                  <option value="Turkmenistan">Turkmenistan</option>
                  <option value="Tuvalu">Tuvalu</option>
                  <option value="Uganda">Uganda</option>
                  <option value="Ukraine">Ukraine</option>
                  <option value="United Arab Emirates">United Arab Emirates</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="United States">United States</option>
                  <option value="Uruguay">Uruguay</option>
                  <option value="Uzbekistan">Uzbekistan</option>
                  <option value="Vanuatu">Vanuatu</option>
                  <option value="Vatican City">Vatican City</option>
                  <option value="Venezuela">Venezuela</option>
                  <option value="Vietnam">Vietnam</option>
                  <option value="Yemen">Yemen</option>
                  <option value="Zambia">Zambia</option>
                  <option value="Zimbabwe">Zimbabwe</option>
                </select>
                {errors.country && (
                  <span className="error-message">
                    {errors.country}
                  </span>
                )}
              </div>

              <div className="form-row">
                <div className="captcha-placeholder">reCAPTCHA</div>
              </div>

              <div className="form-row">
                <button type="submit" className="register-button">
                  REGISTER
                </button>
              </div>

              <div className="form-row text-center">
                <p className="login-link">
                  Already have an account? <Link to="/">Sign In</Link>
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Footer */}
        <footer className="login-footer">
          <div className="footer-inner">
            ©2023 Mighty Lube Systemic Lubrication, Inc.
          </div>
        </footer>
      </div>
    );
};

export default Register;
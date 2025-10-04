import { Link, NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="w-100">
      <nav className="navbar navbar-dark bg-dark navbar-expand-md w-100">
        <div className="container-fluid">{/* full width, no cap */}
          {/* Brand */}
          <Link to="/" className="navbar-brand d-flex align-items-center">
            <span className="me-2">🎬</span>
            <span className="fw-bold" style={{ fontSize: "1.75rem" }}>
              Video Library
            </span>
          </Link>

          {/* Toggler (mobile) */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNav"
            aria-controls="mainNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Right side */}
          <div className="collapse navbar-collapse" id="mainNav">
            <ul className="navbar-nav ms-auto align-items-md-center">
              <li className="nav-item me-2">
                <NavLink to="/user-login" className="btn btn-light">
                  User Login
                </NavLink>
              </li>
              <li className="nav-item me-2">
                <NavLink to="/admin-login" className="btn btn-warning">
                  Admin Login
                </NavLink>
              </li>
              <li className="nav-item">
                {/* blue text link, not a button */}
                <NavLink
                  to="/user-register"
                  className="nav-link text-primary text-decoration-underline px-2"
                >
                  New User Registration
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
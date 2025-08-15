import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";


export default function NavBar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = () => {
  logout();        // clears session
  navigate("/");   // redirects to home
};


  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          Sprint Planner
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {/* Show these only if logged in */}
            {user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/backlog">
                    Backlog
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/sprint-planner">
                    Sprint Planner
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/kanban">
                    Kanban Board
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/standup">
                    Daily Standup
                  </Link>
                </li>
                <li className="nav-item">
                  <button
                    onClick={handleLogout}
                    className="btn btn-link nav-link"
                    style={{ cursor: "pointer" }}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              // Show these if NOT logged in
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/signin">
                    SignIn
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/signup">
                    SignUp
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

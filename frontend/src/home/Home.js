import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <h1>Chase Pay</h1>
      <p>Manage your transactions with ease</p>
      <div className="button-group">
        <Link to="/pay" className="btn btn-primary">
          Make a Payment
        </Link>
        <Link to="/transaction" className="btn btn-secondary">
          View Transactions
        </Link>
      </div>
    </div>
  );
}

export default Home;


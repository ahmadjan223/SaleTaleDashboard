import React from "react";

export default function HomePage() {
  return (
    <div className="content-area home-content">
      <h1>Welcome to SaleTale Dashboard!</h1>
      <p className="tagline">
        Streamlining Your Sales Operations with Precision and Insight.
      </p>
      <div className="features-overview">
        <p>
          SaleTale provides a comprehensive suite of tools to empower your sales
          team and manage your business effectively. From tracking sales and
          managing products to overseeing retailers and salesmen, our dashboard
          offers real-time data and intuitive controls.
        </p>
        <h3>Key Features:</h3>
        <ul>
          <li>
            <strong>Sales Management:</strong> Monitor sales performance, track
            transactions, and analyze trends.
          </li>
          <li>
            <strong>Product Catalog:</strong> Easily add, update, and manage
            your product listings.
          </li>
          <li>
            <strong>Retailer Network:</strong> Keep track of your retailers,
            their locations, and performance.
          </li>
          <li>
            <strong>Sales Team Overview:</strong> Manage your salesmen, verify
            accounts, and monitor activity.
          </li>
          <li>
            <strong>Interactive Data Tables:</strong> Click to copy row data,
            perform quick actions, and navigate with ease.
          </li>
          <li>
            <strong>Secure & Reliable:</strong> Built with modern technologies
            to ensure your data is safe and accessible.
          </li>
        </ul>
        <p>Select an option from the sidebar to get started!</p>
      </div>
    </div>
  );
}

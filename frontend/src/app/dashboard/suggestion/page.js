'use client';

import React, { useState } from 'react';

const SuggestionsPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    suggestion: '',
    category: 'New Source',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState({});

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form data
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required.';
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'A valid email is required.';
    }
    if (!formData.suggestion) newErrors.suggestion = 'Suggestion cannot be empty.';
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Simulate form submission
      setSuccessMessage('Thank you! Your suggestion has been submitted.');
      setFormData({ name: '', email: '', suggestion: '', category: 'New Source' });
      setTimeout(() => setSuccessMessage(''), 5000); // Clear success message after 5 seconds
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-2xl w-full">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-700">Submit Your Suggestions</h1>

        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-center">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-500">Your Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-2 text-gray-500 border ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:outline-none focus:ring focus:ring-blue-300`}
              placeholder="Enter your name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-500">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 text-gray-500 border ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:outline-none focus:ring focus:ring-blue-300`}
              placeholder="Enter your email"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Category Field */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-500">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300 text-gray-500"
            >
              <option value="New Source">New Source</option>
              <option value="Improvement Suggestion">Improvement Suggestion</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Suggestion Field */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-500">Your Suggestion</label>
            <textarea
              name="suggestion"
              value={formData.suggestion}
              onChange={handleChange}
              rows="4"
              className={`w-full px-4 py-2 text-gray-500 border ${
                errors.suggestion ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:outline-none focus:ring focus:ring-blue-300`}
              placeholder="Write your suggestion here..."
            />
            {errors.suggestion && <p className="text-red-500 text-sm mt-1">{errors.suggestion}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
          >
            Submit Suggestion
          </button>
        </form>
      </div>
    </div>
  );
};

export default SuggestionsPage;

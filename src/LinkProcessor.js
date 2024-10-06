// src/LinkProcessor.js
import React, { useState } from 'react';
import axios from 'axios';

const LinkProcessor = () => {
  const [url, setUrl] = useState('');
  const [destinationUrl, setDestinationUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost/process-link', {
        htmlUrl: url
      });

      setDestinationUrl(response.data.data);
    } catch (err) {
      setError('Error processing link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Link Processor</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="url">
            Enter URL
          </label>
          <input
            type="text"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="https://example.com"
            required
          />
        </div>
        <button
          type="submit"
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Process Link'}
        </button>
      </form>

      {destinationUrl && (
        <div className="mt-4 text-green-600 font-bold">
          <p>Destination URL:</p>
          <a href={destinationUrl} target="_blank" rel="noopener noreferrer">{destinationUrl}</a>
        </div>
      )}

      {error && (
        <div className="mt-4 text-red-600 font-bold">
          {error}
        </div>
      )}
    </div>
  );
};

export default LinkProcessor;

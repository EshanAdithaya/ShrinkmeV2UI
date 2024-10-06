import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

const LinkProcessor = () => {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const getUserInfo = async () => {
    try {
      const ipResponse = await axios.get('https://api.ipify.org?format=json');
      const ip = ipResponse.data.ip;

      const geoResponse = await axios.get(`http://ip-api.com/json/${ip}`);
      const geoData = geoResponse.data;

      return {
        ip: ip,
        fullIpChain: ip,
        location: {
          city: geoData.city || 'Unknown',
          region: geoData.regionName || 'Unknown',
          country: geoData.country || 'Unknown',
          latitude: geoData.lat || 'Unknown',
          longitude: geoData.lon || 'Unknown',
          timezone: geoData.timezone || 'Unknown',
          isp: geoData.isp || 'Unknown'
        },
        device: {
          browser: navigator.userAgent,
          os: navigator.platform,
          device: 'Unknown'
        },
        headers: {
          referer: document.referrer || 'N/A',
          language: navigator.language || 'N/A'
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching user info:', error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setResult('');

    try {
      const userInfo = await getUserInfo();
      const response = await axios.post('https://shrinkmev2.adaptable.app/process-link', {
        htmlUrl: url,
        userInfo: userInfo
      });
      setResult(response.data.data);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred while processing the link.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-6 text-center text-indigo-600">Link Processor</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
                Enter URL
              </label>
              <input
                type="url"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                placeholder="https://example.com"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out ${
                isLoading ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                  Processing...
                </>
              ) : (
                'Process Link'
              )}
            </button>
          </form>
          {error && (
            <div className="mt-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          )}
          {result && (
            <div className="mt-4 p-3 bg-green-100 border-l-4 border-green-500 text-green-700 rounded">
              <p className="font-bold mb-1">Processed URL:</p>
              <a href={result} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                {result}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LinkProcessor;
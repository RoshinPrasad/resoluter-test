import React from 'react';

const Loader = () => (
  <div className="flex items-center justify-center h-screen bg-gray-900">
    <dotlottie-player
      src="https://lottie.host/c5060e33-e4e7-4110-b0d3-ab46666f5e1c/k4xZpXVS1t.json"
      background="transparent"
      speed="1"
      style={{ width: "300px", height: "300px" }}
      loop
      autoplay
    />
  </div>
);

export default Loader;

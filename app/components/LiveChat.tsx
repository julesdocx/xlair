import React, { useEffect, useState } from 'react';

const LiveChat = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect if the user is on a mobile device
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Set mobile breakpoint at 768px
    };

    // Check on mount
    handleResize();

    // Add resize listener to update on window resize
    window.addEventListener('resize', handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (!isMobile) {
      // Create the script element only for desktop
      const script = document.createElement('script');
      script.id = 'cid0020000389886120675';
      script.src = '//st.chatango.com/js/gz/emb.js';
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      script.style.width = '288px';
      script.style.height = '403px';

      // Add inline configuration as a string
      script.innerHTML = `{"handle":"xlair","arch":"js","styles":{"a":"000000","b":100,"c":"FFFFFF","d":"000000","k":"000000","l":"000000","m":"000000","n":"FFFFFF","p":"9","usricon":0,"q":"000000","r":100,"t":0,"allowpm":0,"fwtickm":1}}`;

      // Append the script to the div element with id `live-chat-container`
      const container = document.getElementById('live-chat-container');
      if (container) {
        container.appendChild(script);
      }

      // Cleanup to remove the script when the component unmounts
      return () => {
        if (container) {
          container.removeChild(script);
        }
      };
    }
  }, [isMobile]);

  return (
    <div className="chat__container">
      {isMobile ? (
        // Show the link on mobile devices
        <div className="mobile-chat-link">
          <a href="https://xlair.chatango.com/" target="_blank" rel="noopener noreferrer">
            Open Live Chat
          </a>
        </div>
      ) : (
        // Show the live chat only on desktop
        <div id="live-chat-container"></div>
      )}

      <style jsx>{`
        .chat__container {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .mobile-chat-link {
          text-align: center;
          margin-top: 20px;
        }
        .mobile-chat-link a {
          text-decoration: underline;
          color: white;
          font-size: 18px;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
};

export default LiveChat;

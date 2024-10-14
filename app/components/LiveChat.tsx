// app/components/LiveChat.tsx
import React, { useEffect } from 'react';

const LiveChat = () => {
  useEffect(() => {
    // Create the script element
    const script = document.createElement('script');
    script.id = 'cid0020000389886120675';
    script.src = '//st.chatango.com/js/gz/emb.js';
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.style.width = '288px';
    script.style.height = '403px';

    // Add inline configuration as a string
    script.innerHTML = `{"handle":"xlair","arch":"js","styles":{"a":"000000","b":100,"c":"FFFFFF","d":"000000","k":"000000","l":"000000","m":"000000","n":"FFFFFF","p":"10","q":"000000","r":100,"fwtickm":1}}`;

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
  }, []);

  return (
    <div id="live-chat-container" >
    </div>
  );
};

export default LiveChat;

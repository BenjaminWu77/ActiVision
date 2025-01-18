import React, { useState } from 'react';

const WebsiteBlocker: React.FC = () => {
  const [blockedSites, setBlockedSites] = useState<string[]>([]);
  const [site, setSite] = useState<string>('');

  const addSite = () => {
    setBlockedSites([...blockedSites, site]);
    setSite('');
  };

  return (
    <div style={styles.websiteBlocker}>
      <h2>Website Blocker</h2>
      <input
        type="text"
        value={site}
        onChange={(e) => setSite(e.target.value)}
        placeholder="Enter website URL"
        style={styles.input}
      />
      <button onClick={addSite} style={styles.button}>Block</button>
      <ul>
        {blockedSites.map((blockedSite, index) => (
          <li key={index}>{blockedSite}</li>
        ))}
      </ul>
    </div>
  );
};

const styles = {
  websiteBlocker: {
    margin: '20px 0',
  },
  input: {
    padding: '10px',
    margin: '5px 0',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '10px',
    margin: '5px 0',
    borderRadius: '5px',
    border: '1px solid #ccc',
    backgroundColor: '#007bff',
    color: 'white',
    cursor: 'pointer',
  },
};

export default WebsiteBlocker;
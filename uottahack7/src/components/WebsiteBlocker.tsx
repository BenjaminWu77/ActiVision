import React, { useState, useEffect } from 'react';

const presetSites = [
  'youtube.com',
  'tiktok.com',
  'netflix.com',
  'chat.openai.com',
  'twitter.com',
  'reddit.com'
];

const WebsiteBlocker: React.FC = () => {
  const [blockedSites, setBlockedSites] = useState<string[]>([]);
  const [site, setSite] = useState<string>('');

  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.sync.get('blockedSites', (data) => {
        if (data.blockedSites) {
          setBlockedSites(data.blockedSites);
        }
      });
    }
  }, []);

  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.sync.set({ blockedSites });
    }
  }, [blockedSites]);

  const addSite = () => {
    if (site && !blockedSites.includes(site)) {
      setBlockedSites([...blockedSites, site]);
      setSite('');
    }
  };

  const unblockAllSites = () => {
    setBlockedSites([]);
  };

  const toggleSite = (presetSite: string) => {
    if (blockedSites.includes(presetSite)) {
      setBlockedSites(blockedSites.filter((s) => s !== presetSite));
    } else {
      setBlockedSites([...blockedSites, presetSite]);
    }
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
      <button onClick={unblockAllSites} style={styles.button}>Unblock All</button>
      <ul>
        {blockedSites.map((blockedSite, index) => (
          <li key={index}>{blockedSite}</li>
        ))}
      </ul>
      <h3>Preset Sites</h3>
      <ul>
        {presetSites.map((presetSite) => (
          <li key={presetSite}>
            <label>
              <input
                type="checkbox"
                checked={blockedSites.includes(presetSite)}
                onChange={() => toggleSite(presetSite)}
              />
              {presetSite}
            </label>
          </li>
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
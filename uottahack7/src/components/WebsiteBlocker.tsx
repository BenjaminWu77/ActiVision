import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
  const [screenTime, setScreenTime] = useState<number>(0);

  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.sync.get('blockedSites', (data) => {
        if (data.blockedSites) {
          setBlockedSites(data.blockedSites);
        }
      });
      chrome.storage.sync.get('screenTime', (data) => {
        if (data.screenTime) {
          setScreenTime(data.screenTime);
        }
      });
    }
  }, []);

  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.sync.set({ blockedSites });
      chrome.storage.sync.set({ screenTime });
    }
  }, [blockedSites, screenTime]);

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

  const decrementScreenTime = async (minutes: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5001/api/decrement-screen-time', { minutes }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setScreenTime(response.data.screenTime);
    } catch (error) {
      console.error('Failed to decrement screen time', error);
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
      <div>
        <h3>Screen Time: {screenTime} minutes</h3>
        <button onClick={() => decrementScreenTime(1)} style={styles.button}>Use 1 minute</button>
        <button onClick={() => decrementScreenTime(5)} style={styles.button}>Use 5 minutes</button>
      </div>
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
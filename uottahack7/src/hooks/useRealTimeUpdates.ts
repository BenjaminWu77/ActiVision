import { useEffect, useState } from 'react';

const useRealTimeUpdates = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const ws = new WebSocket('ws://your-websocket-url');
    ws.onmessage = (event) => {
      setData(JSON.parse(event.data));
    };
    return () => {
      ws.close();
    };
  }, []);

  return data;
};

export default useRealTimeUpdates;
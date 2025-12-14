import React, { useState, useEffect } from 'react';
import { Clock } from './Icons';

const ClockWidget: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-2 text-blue-600 font-semibold bg-white px-4 py-2 rounded-full shadow-sm border border-blue-100">
      <Clock size={18} />
      <span>{time.toLocaleTimeString('uz-UZ')}</span>
    </div>
  );
};

export default ClockWidget;
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AnimatedBackground from '@/components/AnimatedBackground';
import Navbar from '@/components/Navbar';
import ProcessingLoader from '@/components/ProcessingLoader';

const Processing = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate('/results');
    }, 2000);
  }, []);

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      <Navbar />
      <main className="pt-24">
        <ProcessingLoader />
      </main>
    </div>
  );
};

export default Processing;

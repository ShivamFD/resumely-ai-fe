import { motion, AnimatePresence } from 'framer-motion';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Upload from './pages/Upload';
import Navbar from './components/Navbar';

const pageVariants = {
  initial: {
    opacity: 0,
    x: -20,
  },
  in: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: 'easeInOut',
    },
  },
  out: {
    opacity: 0,
    x: 20,
    transition: {
      duration: 0.3,
      ease: 'easeInOut',
    },
  },
};

function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          variants={pageVariants}
          initial="initial"
          animate="in"
          exit="out"
          className="min-h-[calc(100vh-80px)]"
        >
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/upload" element={<Upload />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default App

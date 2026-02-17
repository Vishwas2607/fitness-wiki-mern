import { Routes, Route } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import { Squash as Hamburger } from 'hamburger-react';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from './components/Sidebar';
import Home from './pages/home';
import Footer from './components/Footer';
import Login from './pages/auth/login';
import Register from './pages/auth/register';
import Dashboard from './pages/dashboard';
import ProtectedRoute from './layouts/protectedRoute';
import WorkoutPreview from './pages/workoutPreview';
import SavedPlans from './pages/savedPlan';
import SpecificPlan from './pages/specificPlan';

function App() {
  const [isOpen, setOpen] = useState<boolean>(false)
  return (
    <>
    <div className='min-h-screen bg-slate-950 flex flex-col gap-6'>
    <header className='header flex justify-between items-center h-12 mb-6'>
      <div className='lg:hidden'>
        <Hamburger toggled={isOpen} toggle={()=>setOpen(!isOpen)} color={"white"} size={24}/>
      </div>
      <h2 className='mr-1'>FitnessWiki</h2>
      <div className='hidden lg:flex'><Navbar /></div>
      <AnimatePresence>
        {isOpen && <motion.div 
        key={"sidebar-wrapper"}
        initial={{x: "-100%"}}
        animate= {{x:0}}
        exit={{x:"-100%"}}
        transition={{duration:0.4, ease:"easeOut"}}
        aria-hidden={!isOpen}
        className='fixed bottom-0 left-0 h-[calc(100vh-48px)] z-10 body-text'
        >
        <Sidebar/>
        </motion.div>
        }
        </AnimatePresence>
    </header>

    <main className='bg-slate-950 flex-1 mb-6'>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>

        <Route element={<ProtectedRoute/>}>
          <Route path="/dashboard" element={<Dashboard/>}/>
          <Route path='/preview-plans' element={<WorkoutPreview/>}/> 
          <Route path='/my-plans' element={<SavedPlans/>} />
          <Route path='/my-plans/:planId' element={<SpecificPlan/>}/>
        </Route>
      </Routes>
    </main>
    <footer className='bg-gray-900 text-slate-200'><Footer/></footer>
    </div>
    </>
  )
}

export default App

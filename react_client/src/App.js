import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PageOne from './Pages/PageOne';
import PageTwo from './Pages/PageTwo';
import PageThree from './Pages/PageThree';
import { CameraProvider } from './CameraContext';

const App = () => {
  return (
    <Router>
      <CameraProvider>
        <Routes>
          <Route path='/' element={<PageOne />} />
          <Route path='/page-two' element={<PageTwo />} />
          <Route path='/page-three' element={<PageThree />} />
        </Routes>
      </CameraProvider>
    </Router>
  );
};

export default App;

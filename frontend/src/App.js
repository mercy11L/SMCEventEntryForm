import './App.css';
import { Navigate,BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Form from './component/Form.jsx';
import Home from './component/Home.jsx';
import SignUp from './component/SignUp.jsx';
import Header from './component/Header.jsx';
import  Login from './component/Login.jsx';
import  Footer from './component/Footer.jsx';
import  About from './component/About.jsx';
import  Contact from './component/Contact.jsx';
import  Download from './component/Download.jsx';
import  AdminLogin from './component/AdminLogin.jsx';
import  DispayEvents from './component/DisplayEvents.jsx';
import  ViewReport from './component/ViewReport.jsx';

function App() {
  return (
    <Router>
      <div className="App">
      <Routes>
      <Route path="/Header" element={<Header/>} />
      <Route path="/" element={<Home />} />
      <Route path="/dispEvents" element={<DispayEvents/>} />
      <Route path="/AdminLogin" element={<AdminLogin/>} />
      <Route path="/Form" element={<Form />} />
      <Route path="/About" element={<About/>} />
      <Route path="/Contact" element={<Contact/>} />
      <Route path="/SignUp" element={<SignUp />} />
      <Route path="/Download" element={<Download />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/ViewReport" element={<ViewReport />} />
      {/* <Route path="/Home" element={<Home />} />*/}
      <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer/>
      </div>
      </Router>

  );
}

export default App;

import { BrowserRouter, Routes, Route, } from "react-router-dom";
import Email from "./Components/Email/Email";
import Home from './Components/Home/Home';


function App() {
  return (
    <BrowserRouter >

    <Routes>
      <Route exact path='/' element={<Home/>}/>
      <Route  path='/email' element={<Email/>}/>
      </Routes>
  
  </BrowserRouter >
  );
}

export default App;

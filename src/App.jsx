import React from "react";
import { useState , useEffect  } from "react";
import Navbar from "./components/Navbar";
import Manager from "./components/Manager";
import "./App.css";
import Footer from "./components/Footer";
// import { Skeleton} from "antd";

function App() {
  // const [loading, setLoading] = useState(true);
  // useEffect(() => {
  //     setTimeout(() => {
  //       setLoading(false);
  //     }, 2000); 
  //   }, []);
  return (
    <>
       
        <Navbar />
        <Manager />
        <Footer />
        
    </>
  );
}

export default App;

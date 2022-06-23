import {BrowserRouter,Routes,Route} from "react-router-dom";
import './App.css';
import InputMyLevel from "./pages/InputMyLevel";
import Ingame from "./pages/Ingame"
import Waiting from "./pages/waiting"

function App({acidlogic, socketIO}) {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<InputMyLevel acidlogic={acidlogic} socketIO={socketIO}/>} />
        <Route path='/waiting' element={<Waiting acidlogic={acidlogic} socketIO={socketIO}/> } />
        <Route path='/ingame' element={<Ingame acidlogic={acidlogic} socketIO={socketIO}/>} />
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

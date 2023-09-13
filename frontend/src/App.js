import "./App.css";
import HomePage from "./Pages/HomePage";
import { Route, Routes } from "react-router-dom";
import ChatPage from "./Pages/ChatPage";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path="/" Component={HomePage} />
        <Route exact path="/chats" Component={ChatPage} />
      </Routes>
    </div>
  );
}

export default App;

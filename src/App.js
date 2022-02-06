import {
  Routes,
  Route
} from "react-router-dom";
import './App.css';
import Home from "./components/home"
import Login from "./components/login"
import Post from "./components/post"
import New from "./components/new"


const NavLinks = function() {
  let token = localStorage.getItem('token')
  if (token !== null) {
    const username = localStorage.getItem('username')
    const id = localStorage.getItem('id');
    return (<>
              <li className="nav-item">
                <a className="nav-link text-white" aria-current="page" href={"/u?user=" + username}>@{username}</a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-white" aria-current="page" href={"/new?user=" + username}>Ask a Question</a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-white" aria-current="page" href="#" onClick={logout}>Logout</a>
              </li>
            </>)
    
  }

  
  if (token === null) {
    return (<>         
              <li className="nav-item" id="login-link">
                <a className="nav-link text-white" aria-current="page" href="/login">Login</a>
              </li>
            </>)
    }
}

function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('username')
  localStorage.removeItem('id')
  localStorage.removeItem('ajbhs')
  window.location.reload()
};

function App() {
  return (
      <div className="App">

        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
          <div className="container-fluid">
            <a className="navbar-brand" href="#">HIVEQA</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse flex-grow-1 text-right" id="navbarSupportedContent">
              <ul className="navbar-nav me-auto">
                <li className="nav-item">
                  <a className="nav-link text-white" aria-current="page" href="/">Home</a>
                </li>
                
                <NavLinks id="protected-links" />
                
              </ul>
            </div>
          </div>
        </nav>
        
        <div className="page-view">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/post" element={<Post />} />
              <Route path="/new" element={<New />} />
            </Routes>
        </div>
      </div>
  );
}

export default App;

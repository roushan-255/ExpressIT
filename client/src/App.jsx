
import { Route,Routes } from "react-router-dom";

import RequireAuth from "./components/auth/RequireAuth.jsx";
import NotFound from "./components/NotFound.jsx";
import PostForm from "./components/post/PostForm.jsx";
import EditProfile from "./pages/EditProfile.jsx";
import EditPost from "./pages/EditPost.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import PostDetail from "./pages/PostDetail.jsx";
import UserPage from "./pages/UserPage.jsx";




function App() {

  return (
    <Routes>
      <Route exact path="/signup" element={<Signup />} />
      <Route exact path="/login" element={<Login />} />
      <Route element={<RequireAuth />}>
        <Route path="/" element={<Home />} />
        <Route path="/new-Post" element={<PostForm />} />
        <Route path="/edit-Post" element={<EditPost/>} />
        <Route path="/:username/Post/:id" element={<PostDetail />} />
        <Route path="/:username/user/:id" element={<UserPage />} />
        <Route path="/edit-profile/:username" element={<EditProfile />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;

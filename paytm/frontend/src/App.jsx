import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Signup } from "./pages/Signup"
import { Dashboard } from "./pages/Dashboard"
import { Send } from "./pages/Send"
import { Signin } from "./pages/Signin"
import { Header } from "./components/Heading"
import { Subheading } from "./components/Subheading"


function App() {

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup></Signup>}></Route>
          <Route path="/signin" element={<Signin></Signin>}></Route>
          <Route path="/dashboard" element={<Dashboard></Dashboard>}></Route>
          <Route path="/send" element={<Send></Send>}></Route>
        </Routes>
      </BrowserRouter>

      <Header label={"pasa kala"}></Header>
      <Subheading label={"kala pasa"}></Subheading>
    </div>
  )
}

export default App

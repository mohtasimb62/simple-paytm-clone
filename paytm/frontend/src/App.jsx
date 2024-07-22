import { BrowserRouter, Route, Routes} from "react-router-dom"
import { Signup } from "./pages/Signup"
 


function App() {

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup></Signup>}></Route>
        </Routes>
      </BrowserRouter>
           
    </div>
  )
}

export default App

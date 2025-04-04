import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Canvas } from './parts/drawing/canvas.tsx'
//import App from './App.tsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Canvas/>
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)

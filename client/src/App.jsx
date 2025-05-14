import { createTheme, CssBaseline, ThemeProvider } from '@mui/material'
import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Routes, Route } from 'react-router-dom'
import HomePage from "./scenes/homePage/HomePage"
import ProfilePage from "./scenes/profilePage/ProfilePage"
import LoginPage from "./scenes/loginPage/LoginPage"
import { themeSettings } from './theme'


const App = () => {
  const mode = useSelector(state=>state.mode);
  const theme= useMemo(()=>createTheme(themeSettings(mode)), [mode])
  const isAuth= Boolean(useSelector(state=>state.token))
  return (
    <div className='app'>
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        <Routes>
           <Route path='/' element={<LoginPage/>}/>
           <Route path='/home' element={isAuth?<HomePage/>: <Navigate to="/" />}/>
           <Route path='/profile/:userId' element={isAuth?<ProfilePage/> : <Navigate to="/"/>}/>
        </Routes>
      </ThemeProvider>
    </div>
  )
}

export default App


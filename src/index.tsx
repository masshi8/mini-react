import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {  BrowserRouter, Routes, Route, Link, Outlet } from "react-router-dom"

// import Home from './list';

// const root = ReactDOM.createRoot(
//   document.getElementById('root') as HTMLElement
// );
// root.render(
//   <React.StrictMode>
//     <BrowserRouter>   <App /></BrowserRouter>
 
//     {/* <Home/> */}
//   </React.StrictMode>
// );
import MyReact from './MyReact/index'

const element = MyReact.createElement(
  'div',
  {
    title: 'hello',
    id: 'sky',
  },
  'world',
  MyReact.createElement('a', null, '我是a标签')
)

const container = document.querySelector('#root')

MyReact.render(element, container);

export default 
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

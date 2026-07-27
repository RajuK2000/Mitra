import React, { useEffect, useState } from 'react'
import { Navigate, replace } from 'react-router-dom'

export const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(sessionStorage.getItem("user"))
  console.log(user, "useruser");
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children
}

import React from 'react'
import NoResult from "../../img/Noresults.png"
import "./notfound.scss"
const NoResultFound = () => {
  return (
    <div className='noresult-container'>
        <img src={NoResult} alt="" />
    </div>
  )
}

export default NoResultFound
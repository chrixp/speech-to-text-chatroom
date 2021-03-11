import React, { useState } from 'react'
import styled from 'styled-components'
import axios from 'axios'
import { v4 } from 'uuid'


const SignUp = () => { 
    const [uuid, setUuid] = useState('')
    const [carName, setCarName] = useState('')
    const [carPic, setCarPic] = useState(null)
    const sendSignUpInfo = () => {
        const formData = new FormData()
        formData.append('carName', carName)
        formData.append('carPic', carPic[0])
        formData.append('uuid', uuid)
        axios.post('/cars', formData)
    }
    return (
        <div>
            <h1>Sign up</h1>
            <button onClick={() => setUuid(v4())}>Generate UUID</button>
            <input value={uuid} onChange={e => setUuid(e.target.value)} type="text"></input>
            <label>Car Name</label>
            <input value={carName} onChange={e => setCarName(e.target.value)} type="text"></input>
            <label>Car Picture</label>
            <input onChange={e => setCarPic(e.target.files)} type="file"></input>
            <button onClick={() => sendSignUpInfo()} >Sign up</button>
      </div>
    )
}

export default SignUp
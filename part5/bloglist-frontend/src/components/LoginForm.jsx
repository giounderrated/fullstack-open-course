import { useState } from 'react'

export const LoginForm = ({ login }) => {

  const [loginForm, setLoginForm] = useState({
    username: '',
    password: '',
  })

  const handleLogin = (event) => {
    event.preventDefault()
    login(loginForm)
    setLoginForm({
      username: '',
      password: '',
    })
  }

  const handleValueChange = (event) => {
    const { name, value } = event.target
    setLoginForm({
      ...loginForm,
      [name]:value
    })
  }

  return (
    <div>
      <h1>Login into the application</h1>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type="text"
            value={loginForm.username}
            name="username"
            onChange={handleValueChange}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={loginForm.password}
            name="password"
            onChange={handleValueChange}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}

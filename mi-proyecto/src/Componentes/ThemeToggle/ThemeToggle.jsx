import './ThemeToggle.css'

function ThemeToggle() {

  return (
    <div className='themeToggle'>

      <span>Light</span>

      <label className='switch'>
        <input type='checkbox' />
        <span className='slider'></span>
      </label>

      <span>Dark</span>

    </div>
  )
}

export default ThemeToggle
<<<<<<< HEAD
export const ThemeToggle = () => (
  <div className="flex bg-gray-100 p-1 rounded-full w-fit">
    <button className="px-4 py-1 bg-white rounded-full shadow-sm text-sm">Light</button>
    <button className="px-4 py-1 text-sm text-gray-500">Dark</button>
  </div>
);
=======
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
>>>>>>> 88d0f8af3f1a9b88cb94f9e872a42dc7929d9327

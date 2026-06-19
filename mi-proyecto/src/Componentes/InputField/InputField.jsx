import './index.css'

function InputField({ placeholder, type='text' }) {

  return (
    <input
      className='inputField'
      type={type}
      placeholder={placeholder}
    />
  )
}

export default InputField

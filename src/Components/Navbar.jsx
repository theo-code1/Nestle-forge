import React from 'react'

const Navbar = () => {

    const [selectedLanguage, setSelectedLanguage] = React.useState('English')

    const languageOptions = ['English', 'French', 'Arabic']
  return (
    <nav className='w-6/7 flex gap-12 bg-indigo-50/50 border-b border-b-black/20 justify-end items-center py-4 px-8 '>
        <ul className='flex gap-8 '>
            <li className='text-[16px] font-medium transition-all duration-150 hover:text-indigo-600'><a href="#">Link01</a></li>
            <li className='text-[16px] font-medium transition-all duration-150 hover:text-indigo-600'><a href="#">Link02</a></li>
            <li className='text-[16px] font-medium transition-all duration-150 hover:text-indigo-600'><a href="#">Link03</a></li>
            <li className='text-[16px] font-medium transition-all duration-150 hover:text-indigo-600'><a href="#">Link04</a></li>
        </ul>
        <button className='text-[16px] font-medium transition-all duration-150 hover:text-indigo-600'>{selectedLanguage}</button>
        <ul>
            {languageOptions.map((option, index) => (
                <li key={index} className='text-[16px] font-medium transition-all duration-150 hover:text-indigo-600'><a href="#">{option}</a></li>
            ))}
        </ul>
        {/* {languageOptions.map((option, index) => (
            <option 
            key={index} 
            className={`text-left px-4 py--2 ${selectedLanguage === option ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`} 
            value={option}
            onClick={() => setSelectedLanguage(option)}
            >{option}</option>
            
        ))} */}
        <div className="login-buttons flex gap-2">
            <button className='bg-indigo-600 text-white px-4 py-2 rounded-lg' type='submit'>Sign up</button>
            <button className='border border-indigo-600 text-indigo-600 px-4 py-2 rounded-lg' type='submit'>Login</button>
        </div>
    </nav>
  )
}

export default Navbar;
import React from 'react'
import DropArrow from '../Components/Icons/DropArrow'
const Navbar = () => {

    const [selectedLanguage, setSelectedLanguage] = React.useState('English')
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false)

    const languageOptions = ['English', 'French', 'Arabic']
    
  return (
    <nav className='relative w-6/7 flex gap-16 bg-indigo-50/50 border-b border-b-black/20 justify-end items-center py-4 px-8 '>
        <ul className='flex gap-12 '>
            <li className='text-[16px] font-medium transition-all duration-150 hover:text-indigo-600'><a href="#">Link01</a></li>
            <li className='text-[16px] font-medium transition-all duration-150 hover:text-indigo-600'><a href="#">Link02</a></li>
            <li className='text-[16px] font-medium transition-all duration-150 hover:text-indigo-600'><a href="#">Link03</a></li>
            <li className='text-[16px] font-medium transition-all duration-150 hover:text-indigo-600'><a href="#">Link04</a></li>
        </ul>
        <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className='group flex items-center gap-1 text-[16px] font-medium transition-all duration-150 hover:text-indigo-600'>{selectedLanguage} <DropArrow className='group-hover:text-indigo-600'/></button>
        {isDropdownOpen && <ul className='absolute top-14 right-60 text-center flex-col gap-2 transition-all duration-100 px-2 pt-3 pb-1 bg-indigo-50/50 rounded-lg border border-black/20'>
            {languageOptions.map((option, index) => (
                <li 
                key={index} 
                onClick={() => {
                    setSelectedLanguage(option);
                    setIsDropdownOpen(false);
                  }}
                className='mb-1'>
                    <a href='#'
                        className='text-lg text-center font-medium transition-all duration-150 px-4 py-1 rounded-md hover:text-white hover:bg-indigo-600'>
                        {option}
                    </a>
                </li>
            ))}
        </ul>}
        {/* {languageOptions.map((option, index) => (
            <option 
            key={index} 
            className={`text-left px-4 py--2 ${selectedLanguage === option ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`} 
            value={option}
            onClick={() => setSelectedLanguage(option)}
            >{option}</option>
            
        ))} */}
        <div className="login-buttons flex gap-2">
            <button className='bg-indigo-600 text-white px-4 py-2 rounded-lg hover:brightness-90 active:brightness-80 transition-all duration-150' type='submit'>Sign up</button>
            <button className='border border-indigo-600 text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-50 active:bg-indigo-100 transition-all duration-150' type='submit'>Login</button>
        </div>
    </nav>
  )
}

export default Navbar;
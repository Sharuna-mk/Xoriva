import React from 'react'

function AuthButton({text}:{text:string }) {
    return (
        <div>
            <button
            type='button'
            className={`w-full bg-black text-white font-medium py-2.5 rounded-lg mt-5 shadow-md hover:shadow-lg transition`}>
                {text}
            </button>
        </div>
    )
}

export default AuthButton

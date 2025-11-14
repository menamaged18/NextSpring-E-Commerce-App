interface Iprops {
    header: string,
    email: string,
    password: string,
}

function DemoAccountDetails({email, header, password}: Iprops) {
  return (
    <div>
        <h2 className="text-xl font-bold mb-4 border-b border-gray-600 pb-2">
            {header}
        </h2>
        
        <div className="space-y-3">
        <p className="font-semibold text-gray-400">
            <span className="text-blue-400">Email:</span>
            <span className="ml-2 font-normal">{email}</span>
        </p>
        <p className="font-semibold text-gray-400">
            <span className="text-blue-400">Password:</span>
            <span className="ml-2 font-normal">{password}</span>
        </p>
        </div>
    </div>
  )
}

export default DemoAccountDetails
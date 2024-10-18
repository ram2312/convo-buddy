export default function Register() {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-center">Welcome to ConvoBuddy</h1>
          <p className="text-center text-gray-600">Sign up to start your journey</p>
          
          <form>
            <div className="space-y-4">
              <div>
                <label className="block mb-1 text-sm">Email</label>
                <input type="email" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
  
              <div>
                <label className="block mb-1 text-sm">Password</label>
                <input type="password" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
  
              <div>
                <label className="block mb-1 text-sm">Confirm Password</label>
                <input type="password" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
  
              <button type="submit" className="w-full p-2 mt-4 text-white bg-blue-500 rounded-lg hover:bg-blue-600">
                Register
              </button>
            </div>
  
            <div className="mt-4 text-sm text-center">
              <a href="/login" className="text-blue-500 hover:underline">Already have an account? Log in</a>
            </div>
          </form>
        </div>
      </div>
    );
  }
  
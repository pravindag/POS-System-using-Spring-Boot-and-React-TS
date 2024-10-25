import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import loginImg from "../../assets/img/login-img.jpeg";
import { useAuth } from '../../context/AuthContext';
import LoadingGif from '../../components/LoadingGif'

const Login = () => {
	const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isErrorActive, setIsErrorActive] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [errors, setErrors] = useState({ username: "", password: "" });

  useEffect(() => {
    const handleWindowLoad = () => {
      setIsPageLoaded(true); 
    };

    if (document.readyState === 'complete') {
      handleWindowLoad();
    } else {
      window.addEventListener("load", handleWindowLoad, false);
      return () => window.removeEventListener('load', handleWindowLoad);
      
    }
  }, []);

  if (!isPageLoaded) {
    return <LoadingGif />;
  }

  const validateInput = () => {
    let hasErrors = false;
    if (!username.trim()) {
      setErrors(prevErrors => ({ ...prevErrors, username: "Email is required." }));
      hasErrors = true;
    }
    if (!password.trim()) {
      setErrors(prevErrors => ({ ...prevErrors, password: "Password is required." }));
      hasErrors = true;
    }
    return !hasErrors;
  };

  function handleUsername(event: any) {
    setUsername(event.target.value);
    if (event.target.value.trim() === "") {
        setErrors(prevErrors => ({ ...prevErrors, username: "Email is required." }));
        setIsErrorActive(!isErrorActive);
    } else {
        setErrors(prevErrors => ({ ...prevErrors, username: "" }));
        setIsErrorActive(isErrorActive);
    }
}

function handlePassword(event: any) {
    setPassword(event.target.value);
    if (event.target.value.trim() === "") {
        setErrors(prevErrors => ({ ...prevErrors, password: "Password is required." }));
        setIsErrorActive(!isErrorActive);
    } else {
        setErrors(prevErrors => ({ ...prevErrors, password: "" }));
        setIsErrorActive(isErrorActive);
    }
}

  const handleSubmit = async (event: React.FormEvent) => {
    setIsLoaded(true);
    event.preventDefault();

    if (!validateInput()) return;

    try {
    
      await axios.post("http://localhost:8080/login", {
                        username: username,
                        password: password
                      })
      .then(response => {
        setIsLoaded(false);
        login(response.data.token, response.data.role);

        if(response.data.role == "user"){
          navigate("/user/dashboard");
        }
      })
      .catch(error => {
        setIsLoaded(false);
        setErrors(prevErrors => ({
          ...prevErrors,
          username: "Invalid credentials, please try again.",
        }));
      });

      
      
    } catch (error) {
      setErrors(prevErrors => ({
        ...prevErrors,
        username: "Invalid credentials, please try again.",
      }));
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl">
        <div className="flex flex-col overflow-y-auto md:flex-row">
          <div className="h-32 md:h-auto md:w-1/2">
            <img aria-hidden="true" className="object-cover w-full h-full dark:hidden" src={loginImg} alt="Office" />
          </div>
          <div className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
            <div className="w-full">
              <h1 className="mb-4 text-xl text-left font-semibold text-gray-700">Login</h1>

              <form onSubmit={handleSubmit}>
                <label className="block mb-4 text-sm text-left">
                  <span className="text-gray-700 font-medium">Email</span>
                  <input
                    className={`block w-full mt-2 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none ${(!isErrorActive && errors.username) ? 'focus:border-red-400 focus:border-2' : 'focus:border-purple-400'} focus:ring-1 focus:ring-purple-300`}
                    placeholder="test@gmail.com"
                    type="email"
                    value={username}
                    onChange={handleUsername}
                  />
                  {errors.username && <span className="text-red-600 text-sm font-medium">{errors.username}</span>}
                </label>

                <label className="block mb-4 text-sm text-left">
                  <span className="text-gray-700 font-medium">Password</span>
                  <input
                    className={`block w-full mt-2 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none ${(!isErrorActive && errors.password) ? 'focus:border-red-400 focus:border-2' : 'focus:border-purple-400'} focus:ring-1 focus:ring-purple-300`}
                    placeholder="***************"
                    type="password"
                    value={password}
                    onChange={handlePassword}
                  />
                  {errors.password && <span className="text-red-600 text-sm font-medium">{errors.password}</span>}
                </label>

                <button type="submit" className="block w-full px-4 py-2 mb-4 text-sm font-medium leading-5 text-center text-white bg-purple-500 rounded-lg hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple">
                  Log in
                </button>
              </form>

              {isLoaded && <LoadingGif /> }

              {/* You can add other content like social login buttons here */}
              <hr className="my-8" />

              <button
                className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium leading-5 text-gray-700 transition-colors duration-150 border bg-purple-100 hover:bg-purple-200 rounded-lg active:bg-transparent active:text-gray-500 focus:outline-none focus:shadow-outline-purple"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                  />
                </svg>
                Github
              </button>
              <button
                className="flex items-center justify-center w-full px-4 py-2 mt-4 text-sm font-medium leading-5 text-gray-700 transition-colors duration-150 border bg-purple-100 hover:bg-purple-200 rounded-lg active:bg-transparent active:text-gray-500 focus:outline-none focus:shadow-outline-purple"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63.961-.689 1.8-1.56 2.46-2.548l-.047-.02z"
                  />
                </svg>
                Twitter
              </button>

              <p className="mt-4">
                <a
                  className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
                  href="./forgot-password.html"
                >
                  Forgot your password?
                </a>
              </p>
              <p className="mt-1">
                <a
                  className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
                  href="./create-account.html"
                >
                  Create account
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

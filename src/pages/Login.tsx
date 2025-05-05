import { useNavigate } from "react-router-dom";
import { useState } from "react";
import background from '../../public/auth/auth-bg.png';
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import welcome from "../../public/auth/welcome-dark.png";
export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "demo@email.com" && password === "demo") {
      setError(false);
      localStorage.setItem("isAuthenticated", "true");
      navigate("/dashboard");
    } else {
      setError(true);
      localStorage.setItem("isAuthenticated", "false");
    }
  };

  return (
    <div>
      <div className="flex flex-col lg:flex-row w-screen h-screen" id="kt_app_root">
        <div
          className="order-1 lg:order-2 flex flex-row w-full lg:w-1/2 bg-cover bg-center h-auto lg:h-full"
          style={{ backgroundImage: `url(${background})` }}
        >
          <div className="flex flex-col items-center justify-center py-2 lg:py-15 px-5 md:px-15 w-full">
            <a href="#" className="mb-0 lg:mb-12">
              <img
                alt="Logo"
                src={welcome}
                className="h-[60px] lg:h-[100px]"
              />
            </a>
            <h1 className="hidden lg:block text-white text-4xl font-bold text-center mb-7">
              Fast, Efficient and Productive
            </h1>
            <div className="hidden lg:block text-white text-base text-center">
              In this demo,{' '}
              <span className="hover:opacity-75 text-yellow-500 font-bold mr-1">
                our system
              </span>
              showcases an interactive example of a construction ERP built with React Js. <br />
              Experience how modern design integrates with essential project management tools, delivering an intuitive and efficient user experience.
            </div>
          </div>
        </div>

        <div className="order-2 lg:order-1 flex flex-col lg:flex-row items-center justify-center w-full lg:w-1/2">
          <div className="flex items-center justify-center flex-col lg:flex-row"></div>
            <div className="lg:w-[500px] p-10">
              <div className="text-center mb-11">
                <h1 className="text-gray-900 font-bold mb-3">
                  Sign In
                </h1>
                <div className="text-gray-500 font-semibold text-base">
                  Access Your ERP Dashboard
                </div>
              </div>
              <form
                className="form w-full"
                id="kt_login_signin_form"
                method="post"
                action={''}
                onSubmit={handleLogin}
              >
                <div className="mb-5 w-100">
                  <input
                    type="email"
                    className="form-control h-[50px] w-100 p-4 border-1 rounded-sm"
                    name="email"
                    placeholder="Email"
                    autoComplete="off"
                    required
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="mb-5 w-100">
                  <input
                    type="password"
                    className="form-control h-[50px] w-100 p-4 border-1 rounded-sm"
                    name="password"
                    placeholder="Password"
                    autoComplete="off"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </form>
              {/* <div className="flex items-center justify-between flex-wrap gap-3 text-base font-semibold">
                <div></div>
                <a
                  href="{{asset('')}}/metronic8/demo1/authentication/layouts/corporate/reset-password.html"
                  className="text-blue-500 hover:underline"
                >
                  Forgot Password ?
                </a>
              </div> */}
              <div className="text-center mt-5">
                <Button
                  type="submit"
                  form="kt_login_signin_form"
                  className="w-full h-[50px] cursor-pointer"
                >
                  Sign In
                </Button>
              </div>
              <div className="grid mb-10">
                <div className="text-center mt-10"></div>
              </div>
              {error ?
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    Invalid Credentials. Please try again
                  </AlertDescription>
                </Alert>
                : null}
              <div className="text-center mt-5">
                <p>Demo Credentials:</p>
                <p>Email: <strong>demo@email.com</strong></p>
                <p>Password: <strong>demo</strong></p>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}

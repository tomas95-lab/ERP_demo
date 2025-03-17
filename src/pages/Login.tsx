import background from '../../public/auth/auth-bg.png';

export default function Login() {
  return (
    <>
      <div className="flex w-screen h-screen" id="kt_app_root">
        {/* Contenedor izquierdo */}
        <div className="flex flex-col lg:flex-row items-center justify-center w-full lg:w-1/2 p-10">
          <div className="flex items-center justify-center flex-col lg:flex-row">
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
                    action="#"
                    method="post">
                    <div className="mb-5 w-100">
                        <input
                            type="email"
                            className="form-control h-[50px] w-100"
                            name="email"
                            placeholder="Email"
                            autoComplete="off"
                        />
                    </div>
                    <div className="mb-5 w-100">
                        <input
                            type="password"
                            className="form-control h-[50px] w-100"
                            name="password"
                            placeholder="Password"
                            autoComplete="off"
                        />
                    </div>
                </form>
              <div className="flex items-center justify-between flex-wrap gap-3 text-base font-semibold">
                <div></div>
                <a
                  href="{{asset('')}}/metronic8/demo1/authentication/layouts/corporate/reset-password.html"
                  className="text-blue-500 hover:underline"
                >
                  Forgot Password ?
                </a>
              </div>
              <div className="grid mb-10">
                <div className="text-center mt-10"></div>
              </div>
              <div className="text-center mt-5">
                <p>Demo Credentials:</p>
                <p>Email: <strong>demo@email.com</strong></p>
                <p>Password: <strong>demo</strong></p>
              </div>
            </div>
          </div>
        </div>

        {/* Contenedor derecho */}
        <div
          className="flex lg:flex-row w-full lg:w-1/2 bg-cover bg-center h-full"
          style={{ backgroundImage: `url(${background})` }}
        >
          <div className="flex flex-col items-center justify-center py-7 lg:py-15 px-5 md:px-15 w-full">
            <a href="#" className="mb-0 lg:mb-12">
              <img
                alt="Logo"
                src="{{asset('metronic/media/logos/landing.svg')}}"
                className="h-[60px] lg:h-[75px]"
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
              displays an interactive example of an ERP built with Symfony and Metronic. <br />
              Discover how modern design integrates with basic functionalities, providing an intuitive and attractive user experience.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

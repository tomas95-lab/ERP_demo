export default function Login() {
    return(
        <>
            <div className="d-flex flex-column flex-root" id="kt_app_root">
                <div className="d-flex flex-column flex-lg-row flex-column-fluid">
                    <div className="d-flex flex-column flex-lg-row-fluid w-lg-50 p-10 order-2 order-lg-1">
                        <div className="d-flex flex-center flex-column flex-lg-row-fluid">
                            <div className="w-lg-500px p-10">
                                <div className="text-center mb-11">
                                    <h1 className="text-gray-900 fw-bolder mb-3">
                                        Sign In
                                    </h1>
                                    <div className="text-gray-500 fw-semibold fs-6">
                                        Access Your ERP Dashboard
                                    </div>
                                </div>
                                <div className="fv-row mb-8 fv-plugins-icon-container">
                                    <div className="fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"></div>
                                </div>
                                <div className="fv-row mb-3 fv-plugins-icon-container">
                                    <div className="form-group"></div>
                                    <div className="fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"></div>
                                </div>
                                <div className="d-flex flex-stack flex-wrap gap-3 fs-base fw-semibold">
                                    <div></div>
                                    <a href="{{asset('')}}/metronic8/demo1/authentication/layouts/corporate/reset-password.html" className="link-primary">
                                        Forgot Password ?
                                    </a>
                                </div>
                                <div className="d-grid mb-10">
                                    <div className="form-group text-center mt-10"></div>
                                </div>
                                <div className="text-center mt-5">
                                    <p>Demo Credentials:</p>
                                    <p>Email: <strong>demo@email.com</strong></p>
                                    <p>Password: <strong>demo</strong></p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex flex-lg-row-fluid w-lg-50 bgi-size-cover bgi-position-center order-1 order-lg-2" style={{backgroundImage: "url('{{asset('metronic/media/svg/illustrations/login-visual-2.svg')}}')"}}>
                        <div className="d-flex flex-column flex-center py-7 py-lg-15 px-5 px-md-15 w-100">
                            <a href="#" className="mb-0 mb-lg-12">
                                <img alt="Logo" src="{{asset('metronic/media/logos/landing.svg')}}" className="h-60px h-lg-75px"></img>
                            </a>
                            <h1 className="d-none d-lg-block text-white fs-2qx fw-bolder text-center mb-7">
                                Fast, Efficient and Productive
                            </h1>
                            <div className="d-none d-lg-block text-white fs-base text-center">
                                In this demo, <span className="opacity-75-hover text-warning fw-bold me-1">our system</span>
                                displays an interactive example of an ERP built with Symfony and Metronic. <br></br>
                                Discover how modern design integrates with basic functionalities, providing an intuitive and attractive user experience.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
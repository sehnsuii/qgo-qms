// Print Queue - Last Page

import { Head, Link } from '@inertiajs/react';


export default function PrintQueue({ auth, laravelVersion, phpVersion }) {
    const handleImageError = () => {
        document
            .getElementById('screenshot-container')
            ?.classList.add('!hidden');
        document.getElementById('docs-card')?.classList.add('!row-span-1');
        document
            .getElementById('docs-card-content')
            ?.classList.add('!flex-row');
            document.getElementById('background')?.classList.add('!hidden');
    };

    return (
        <>
            <Head title="Welcome" />
            <div className="min-h-screen flex flex-col bg-gray-50 text-black/50 dark:bg-black dark:text-white/50">
                <img
                    id="background"
                    className="absolute inset-0 w-full h-full object-cover"
                    src="https://upload.wikimedia.org/wikipedia/commons/a/ad/6346Poblacion_City_Hall_San_Pedro_Laguna_27.jpg"
                />

                <header className="relative w-full bg-white shadow-md py-4 flex items-center justify-between px-6">
                    <div className="flex items-center w-1/3">
                        <img
                            src="https://cityofsanpedrolaguna.gov.ph/wp-content/uploads/2023/02/logo-sanpedro.png"
                            alt="SP Logo"
                            className="h-12 mr-3"
                        />
                        <h1 className="text-xl font-semibold text-black">City of San Pedro Laguna</h1>
                    </div>
                    
                    <div className="flex flex-1 justify-center">
                    <Link href="/">
                        <img
                            src="https://i.pinimg.com/736x/b0/1d/a1/b01da1459e9c98b05f0458aeecc6a87f.jpg"
                            alt="QGo Logo"
                            className="h-16"
                        />
                    </Link>
                    </div>

                    <nav className="w-1/3 flex justify-end">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="text-black hover:text-gray-700"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="mr-4 text-black hover:text-gray-700"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="text-black hover:text-gray-700"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </header>

                <div className="flex flex-1 flex-col items-center justify-center relative">
                    <div className="bg-green-600 p-10 rounded-3xl shadow-lg w-[800px] h-[510px] flex flex-col items-center justify-center">
                        <h2 className="text-6xl font-bold text-white mb-3 font-[Verdana]">Thank You!</h2>
                        <hr className="w-4/5 border-2 border-white my-5 mx-auto" />
                        <p className="text-xl font-small text-white mb-8">Your queue number is: </p>
                        <p className="text-xl font-small text-white mb-8">Please wait for your turn.</p>
                        <div className="justify-center gap-6 mt-6">
                            <Link
                                href="/Welcome"
                                className="px-14 py-4 bg-white text-green-600 text-lg font-semibold rounded-lg shadow-md hover:bg-gray-200"
                            >
                                PRINT NEW QUEUE 
                            </Link>                                                    
                        </div>
                        
                    </div>
                </div>

                <footer className="relative w-full bg-white shadow-md py-4 text-center text-sm text-black mt-auto">
                    QGo {laravelVersion} (PHP v{phpVersion})
                </footer>
            </div>
        </>
    );
}

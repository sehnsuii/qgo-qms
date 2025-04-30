//Service Selection

import { Head, Link } from '@inertiajs/react';

export default function ServiceSelection({ auth, laravelVersion, phpVersion }) {
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
                    <div className="bg-green-600 p-10 rounded-3xl shadow-lg w-[800px] h-[480px] flex flex-col items-center justify-center">
                        <h2 className="text-6xl font-bold text-white mb-2 font-[Verdana]">UNA SA LAGUNA</h2>
                        <hr className="w-4/5 border-2 border-white my-5 mx-auto" />
                        <p className="text-xl font-small text-white mb-5">Please select the service you're looking for...</p>
                        <p className="text-xl font-small text-white mb-5">Mangyaring piliin ang serbisyong iyong hinahanap...</p>
                        <div className="grid grid-cols-2 gap-6 mt-4">
                            <Link
                                href="/DetailSummary"
                                className="w-80 h-14 flex items-center justify-center bg-white text-green-600 text-lg font-semibold rounded-lg shadow-md hover:bg-gray-200"
                            >
                                BURIAL ASSISTANCE
                            </Link>
                            <Link
                                href="/DetailSummary"
                                className="w-80 h-14 flex items-center justify-center bg-white text-green-600 text-lg font-semibold rounded-lg shadow-md hover:bg-gray-200"
                            >
                                EDUCATIONAL ASSISTANCE
                            </Link>
                            <Link
                                href="/DetailSummary"
                                className="w-80 h-14 flex items-center justify-center bg-white text-green-600 text-lg font-semibold rounded-lg shadow-md hover:bg-gray-200"
                            >
                                MEDICAL ASSISTANCE
                            </Link>
                            <Link
                                href="/DetailSummary"
                                className="w-80 h-14 flex items-center justify-center bg-white text-green-600 text-lg font-semibold rounded-lg shadow-md hover:bg-gray-200"
                            >
                                RECEIVING
                            </Link>
                        </div>
                            <Link
                                href="/DetailSummary"
                                className="px-9 py-3 flex items-center justify-center bg-white text-green-600 text-lg font-semibold rounded-lg shadow-md hover:bg-gray-200 mt-5"
                            >
                                SCHEDULE AN APPOINTMENT
                            </Link>
                        
                    </div>
                    <div className="flex justify-center w-[800px] mt-3">
                        <Link
                            href="/CustomerSelection"
                            className="px-10 py-3 bg-green-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-green-700"
                        >
                            BACK
                        </Link>
                    </div>
                </div>

                <footer className="relative w-full bg-white shadow-md py-4 text-center text-sm text-black mt-auto">
                    QGo {laravelVersion} (PHP v{phpVersion})
                </footer>
            </div>
        </>
    );
}

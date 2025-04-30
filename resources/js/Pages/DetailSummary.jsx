import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function DetailSummary({ auth, laravelVersion, phpVersion }) {
    const [showModal, setShowModal] = useState(false);

    const handleImageError = () => {
        document.getElementById('screenshot-container')?.classList.add('!hidden');
        document.getElementById('docs-card')?.classList.add('!row-span-1');
        document.getElementById('docs-card-content')?.classList.add('!flex-row');
        document.getElementById('background')?.classList.add('!hidden');
    };

    const handlePrintClick = (e) => {
        e.preventDefault();
        setShowModal(true);
    };

    const handlePrintNew = () => {
        window.print();
    };

    const handleCloseModal = () => {
        setShowModal(false);
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
                            <Link href={route('dashboard')} className="text-black hover:text-gray-700">
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link href={route('login')} className="mr-4 text-black hover:text-gray-700">
                                    Log in
                                </Link>
                                <Link href={route('register')} className="text-black hover:text-gray-700">
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </header>

                <div className="flex flex-1 flex-col items-center justify-center relative">
                    <div className="bg-green-600 p-10 rounded-3xl shadow-lg w-[800px] h-[470px] flex flex-col items-center justify-center">
                        <h2 className="text-6xl font-bold text-white mb-4 font-[Verdana]">UNA SA LAGUNA</h2>
                        <hr className="w-4/5 border-2 border-white my-5 mx-auto" />
                        <p className="text-xl text-white mb-5">Review Details Summary:</p>

                        <p className="text-xl text-white mb-5">Please get your printed queue</p>
                        <div className="justify-center gap-6 mt-6">
                            <a
                                href="#"
                                onClick={handlePrintClick}
                                className="px-14 py-4 bg-white text-green-600 text-lg font-semibold rounded-lg shadow-md hover:bg-gray-200"
                            >
                                PRINT QUEUE NUMBER
                            </a>
                        </div>
                    </div>
                    <div className="flex justify-center w-[800px] mt-3">
                        <Link
                            href="/Welcome"
                            className="px-10 py-3 bg-green-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-green-700"
                        >
                            BACK TO HOME
                        </Link>
                    </div>
                </div>

                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl p-8 shadow-lg w-[500px] h-[450px] text-center flex flex-col items-center justify-center">
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Yes_Check_Circle.svg/1024px-Yes_Check_Circle.svg.png"
                                alt="Check"
                                className="w-24 h-24 mb-4"
                            />
                            <h2 className="text-5xl font-bold text-green-600 mb-2">Thank You!</h2>
                            <p className="text-1xl text-gray-700 mb-7">Your queue number has been printed.</p>
                            <div className="flex justify-center gap-5">
                                <button
                                    onClick={handlePrintNew}
                                    className="bg-green-600 text-white px-5 py-3 rounded hover:bg-green-700 text-1xl"
                                >
                                    Print Queue
                                </button>
                                <button
                                    onClick={handleCloseModal}
                                    className="bg-green-600 text-white px-5 py-3 rounded hover:bg-green-700 text-1xl"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <footer className="relative w-full bg-white shadow-md py-4 text-center text-sm text-black mt-auto">
                    QGo {laravelVersion} (PHP v{phpVersion})
                </footer>
            </div>
        </>
    );
}

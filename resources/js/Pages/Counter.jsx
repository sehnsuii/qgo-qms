import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import Swal from 'sweetalert2';

export default function Counter({ counterId }) {
    const [counterStatus, setCounterStatus] = useState('offline');
    const [currentQueue, setCurrentQueue] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        if (!counterId) {
            setError('Counter ID not assigned to this user.');
            setIsLoading(false);
            return;
        }
        if (!currentQueue && !error) setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/counters/${counterId}`);
            if (!response.ok) {
                let errorMsg = `API error! status: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMsg = errorData.message || errorMsg;
                } catch (parseError) {
                    // Ignore if response is not JSON
                }
                throw new Error(errorMsg);
            }
            const data = await response.json();
            setCurrentQueue(data.queue);
            setCounterStatus(data.status || 'offline');
        } catch (err) {
            console.error('Error fetching counter data:', err);
            setError(err.message);
            setCurrentQueue(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 15000); // Refresh every 15 seconds
        return () => clearInterval(interval);
    }, [counterId]);

    const updateQueueStatus = async (queueId, status) => {
        if (!queueId) return;
        let endpointSuffix = '';
        switch (status) {
            case 'Completed':
                endpointSuffix = 'complete';
                break;
            case 'Waiting':
                endpointSuffix = 'wait';
                break;
            case 'Cancelled':
                endpointSuffix = 'cancel';
                break;
            default:
                console.error(`Invalid status provided to updateQueueStatus: ${status}`);
                Swal.fire('Error', `Invalid status action: ${status}`, 'error');
                return;
        }

        setIsUpdating(true);
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
            const apiUrl = `/api/queues/${queueId}/${endpointSuffix}`;

            const response = await fetch(apiUrl, {
                method: 'PATCH',
                headers: {
                    // 'Content-Type': 'application/json', // Body is likely not needed for these specific actions
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': csrfToken
                },
                // body: JSON.stringify({ status: status }) // Body is likely not needed
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `API error! status: ${response.status}`);
            }

            Swal.fire('Success', `Queue marked as ${status}.`, 'success');
            await fetchData();

        } catch (err) {
            console.error('Error updating queue status:', err);
            Swal.fire('Error', `Failed to update queue status: ${err.message}`, 'error');
        } finally {
            setIsUpdating(false);
        }
    };

    const updateCounterStatus = async (newStatus) => {
        if (!counterId) return;
        setIsUpdating(true);
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
            const response = await fetch(`/api/counters/${counterId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': csrfToken
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (!response.ok) {
                 const errorData = await response.json();
                throw new Error(errorData.message || `API error! status: ${response.status}`);
            }

            setCounterStatus(newStatus);
             Swal.fire('Success', `Counter is now ${newStatus}.`, 'success');
             await fetchData();

        } catch (err) {
            console.error('Error updating counter status:', err);
            Swal.fire('Error', `Failed to update counter status: ${err.message}`, 'error');
        } finally {
            setIsUpdating(false);
        }
    };

    const callNextCustomer = async () => {
        if (!counterId) return;
        setIsUpdating(true);
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
            const response = await fetch(`/api/counters/${counterId}/call-next`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': csrfToken
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `API error! status: ${response.status}`);
            }

            const data = await response.json();
            Swal.fire('Called', `Now serving ${data.queue_number}.`, 'success');
            await fetchData();

        } catch (err) {
            console.error('Error calling next customer:', err);
            if (err.message && err.message.toLowerCase().includes('no customers waiting')) {
                 Swal.fire('Info', 'No customers are currently waiting.', 'info');
            } else {
                Swal.fire('Error', `Failed to call next customer: ${err.message}`, 'error');
            }
        } finally {
            setIsUpdating(false);
        }
    };


    return (
        <>
            <Head title={`Counter ${counterId || 'Control'}`} />
            <header className="bg-white shadow">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <h1 className="text-xl font-semibold leading-tight text-gray-800">
                         Counter {counterId || 'N/A'} - Management
                    </h1>
                </div>
            </header>

            <main className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white p-6 shadow-sm sm:rounded-lg">
                        {isLoading ? (
                             <div className="text-center py-10">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                                <p className="mt-3 text-sm text-gray-600">Loading counter information...</p>
                            </div>
                        ) : error ? (
                            <div className="rounded-md bg-red-50 p-4">
                                <div className="flex">
                                    <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                                    <div className="mt-2 text-sm text-red-700">
                                        <p>{error}</p>
                                    </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div className="mb-6 border-b pb-4">
                                     <h3 className="text-lg font-medium leading-6 text-gray-900">Counter Status</h3>
                                     <p className={`mt-1 text-sm font-semibold ${
                                         counterStatus === 'ready' ? 'text-green-600' :
                                         counterStatus === 'busy' ? 'text-yellow-600' : 'text-red-600'
                                     }`}>
                                         Currently: {
                                             counterStatus === 'ready' ? 'ONLINE (Ready)' :
                                             counterStatus === 'busy' ? 'ONLINE (Busy)' : 'OFFLINE'
                                         }
                                     </p>
                                     {counterStatus !== 'busy' && (
                                         <SecondaryButton
                                         className="mt-2"
                                         onClick={() => updateCounterStatus(counterStatus === 'ready' ? 'offline' : 'online')}
                                         disabled={isUpdating || !!currentQueue}
                                         title={currentQueue ? "Cannot change status while a customer is assigned. Resolve queue first." : ""}
                                     >
                                         {isUpdating ? 'Updating...' : (counterStatus === 'ready' ? 'Go Offline (Break)' : 'Go Online')}
                                     </SecondaryButton>)}
                                </div>

                                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Current Queue</h3>
                                {currentQueue ? (
                                    <div className="rounded-md border border-gray-300 bg-gray-50 p-4">
                                        <p className="text-2xl font-bold text-blue-600">{currentQueue.queue_number}</p>
                                        <p>Service: {currentQueue.service?.name || 'N/A'}</p>
                                        <p>Type: {currentQueue.customer_type}</p>
                                        <p>Status: <span className="font-semibold">{currentQueue.status}</span></p>
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            <PrimaryButton
                                                onClick={() => updateQueueStatus(currentQueue.id, 'Completed')}
                                                disabled={isUpdating || currentQueue.status !== 'Now Serving'}
                                                title={currentQueue.status !== 'Now Serving' ? 'Can only complete queues that are "Now Serving"' : ''}
                                            >
                                                Mark Completed
                                            </PrimaryButton>
                                            <SecondaryButton
                                                onClick={() => updateQueueStatus(currentQueue.id, 'Waiting')}
                                                disabled={isUpdating || currentQueue.status !== 'Now Serving'}
                                                title={currentQueue.status !== 'Now Serving' ? 'Can only return queues that are "Now Serving" to waiting' : ''}
                                            >
                                                Set Back to Waiting
                                            </SecondaryButton>
                                            <DangerButton
                                                onClick={() => updateQueueStatus(currentQueue.id, 'Cancelled')}
                                                disabled={isUpdating || currentQueue.status !== 'Now Serving'}
                                                title={currentQueue.status !== 'Now Serving' ? 'Can only cancel queues that are "Now Serving"' : ''}
                                            >
                                                Cancel Queue
                                            </DangerButton>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center text-gray-500 py-6">
                                        <p>No customer currently assigned to this counter.</p>
                                         {/* Show Call Next only if 'ready' */}
                                         {counterStatus === 'ready' && (
                                            <PrimaryButton
                                                className="mt-4"
                                                onClick={callNextCustomer}
                                                disabled={isUpdating}
                                            >
                                                {isUpdating ? 'Calling...' : 'Call Next Customer'}
                                            </PrimaryButton>
                                        )}
                                        {/* Show message if 'busy' */}
                                        {counterStatus === 'busy' && (
                                            <p className="mt-4 text-sm italic text-yellow-700">Counter is busy. Finish serving current customer.</p>
                                        )}
                                        {/* Show message if 'offline' */}
                                        {counterStatus === 'offline' && (
                                            <p className="mt-4 text-sm italic">Counter is offline. Go online to call customers.</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                         {isUpdating && !isLoading && <p className="mt-4 text-sm text-gray-500 animate-pulse">Processing request...</p>}
                    </div>
                </div>
            </main>
        </>
    );
}
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

// Accept 'counter' prop (will be null for standard login)
export default function Login({ status, canResetPassword, counter }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  const submit = (e) => {
    e.preventDefault();

    // Determine the target route based on whether 'counter' prop exists
    const targetRoute = counter
      ? route('counter.login.store', { counter: counter.id }) // Use counter-specific route
      : route('login'); // Use standard login route

    post(targetRoute, {
      onFinish: () => reset('password'),
    });
  };

  return (
    <GuestLayout>
      {/* Dynamically set title */}
      <Head title={counter ? `Counter ${counter.id} Log in` : 'Log in'} />

      {/* Optionally display which counter is being logged into */}
      {counter && <div className='mb-4 rounded bg-blue-100 p-3 text-center text-sm font-medium text-blue-700'>Logging into Counter {counter.id}</div>}

      {status && <div className='mb-4 text-sm font-medium text-green-600'>{status}</div>}

      <form onSubmit={submit}>
        <div>
          <InputLabel
            htmlFor='email'
            value='Email'
          />

          <TextInput
            id='email'
            type='email'
            name='email'
            value={data.email}
            className='mt-1 block w-full'
            autoComplete='username'
            isFocused={true}
            onChange={(e) => setData('email', e.target.value)}
          />

          <InputError
            message={errors.email}
            className='mt-2'
          />
        </div>

        <div className='mt-4'>
          <InputLabel
            htmlFor='password'
            value='Password'
          />

          <TextInput
            id='password'
            type='password'
            name='password'
            value={data.password}
            className='mt-1 block w-full'
            autoComplete='current-password'
            onChange={(e) => setData('password', e.target.value)}
          />

          <InputError
            message={errors.password}
            className='mt-2'
          />
        </div>

        <div className='mt-4 block'>
          <label className='flex items-center'>
            <Checkbox
              name='remember'
              checked={data.remember}
              onChange={(e) => setData('remember', e.target.checked)}
            />
            <span className='ms-2 text-sm text-gray-600'>Remember me</span>
          </label>
        </div>

        <div className='mt-4 flex items-center justify-end'>
          {canResetPassword && (
            <Link
              href={route('password.request')}
              className='rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
            >
              Forgot your password?
            </Link>
          )}

          <PrimaryButton
            className='ms-4'
            disabled={processing}
          >
            Log in
          </PrimaryButton>
        </div>
      </form>
    </GuestLayout>
  );
}

import { _mock } from 'src/_mock';

// ----------------------------------------------------------------------
// @deprecated - This hook returns mock/static data.
// Use `useAuthContext` instead to get real user data from the backend.
//
// Migration:
//   - import { useMockedUser } from 'src/auth/hooks';
//   + import { useAuthContext } from 'src/auth/hooks';
//
//   - const { user } = useMockedUser();
//   + const { user } = useAuthContext();
// ----------------------------------------------------------------------

/**
 * @deprecated Use `useAuthContext` instead for real user data.
 */
export function useMockedUser() {
  if (process.env.NODE_ENV === 'development') {
    console.warn(
      '[DEPRECATED] useMockedUser is deprecated. Use useAuthContext instead for real user data.'
    );
  }

  const user = {
    id: '8864c717-587d-472a-929a-8e5f298024da-0',
    displayName: 'Jaydon Frankie',
    email: 'demo@minimals.cc',
    photoURL: _mock.image.avatar(24),
    phoneNumber: _mock.phoneNumber(1),
    country: _mock.countryNames(1),
    address: '90210 Broadway Blvd',
    state: 'California',
    city: 'San Francisco',
    zipCode: '94116',
    about: 'Praesent turpis. Phasellus viverra nulla ut metus varius laoreet. Phasellus tempus.',
    role: 'admin',
    isPublic: true,
  };

  return { user };
}

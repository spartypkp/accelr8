# Authentication Debugging Report

## Issue Summary
The application is making repeated POST requests to `/auth/v1/token?grant_type=refresh_token` at a very high frequency. This is causing rate limit issues with Supabase authentication. The requests are being made by "Next.js Middleware" according to the logs.

## Root Causes Identified

### 1. Middleware Token Refresh Loop

The primary issue is a token refresh loop in the middleware. Each page request triggers the middleware, which:

1. Creates a new Supabase client instance
2. Attempts to get the current session
3. If a session exists but is expired/near expiry, Supabase automatically attempts to refresh it
4. The middleware returns, but the next navigation or client-side transition triggers another refresh

This creates a cascading effect where each navigation or component mount can trigger additional token refresh requests.

### 2. Client-Side Context Setup

The `AuthProvider` component in `src/lib/auth/context.tsx` is also creating its own Supabase client and setting up `onAuthStateChange` listeners, which may be triggering additional authentication operations.

## File-by-File Analysis

### 1. `middleware.ts`

**Critical Issue**: 
- Creates a new Supabase client for every request
- Calls `supabase.auth.getSession()` unconditionally
- Calls `supabase.auth.getUser()` when a session exists
- Performs database queries within the middleware

The middleware processes every request to the application except static files. Each request creates a new Supabase client and checks authentication, which is extremely inefficient.

```typescript
// Creates a new Supabase client for EVERY request
const supabase = createServerClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { ... }
);

// Gets session unconditionally - triggers token refresh when near expiry
const { data: { session } } = await supabase.auth.getSession();

// Gets user if session exists - another potential API call
const { data: { user } } = await supabase.auth.getUser();
```

### 2. `src/lib/auth/context.tsx`

**Potential Issues**:
- Sets up `onAuthStateChange` subscription that may trigger on token refreshes
- Performs additional Supabase queries when auth state changes
- Makes extra database calls to fetch user role

```typescript
// Subscription to auth state changes
const { data: { subscription } } = supabase.auth.onAuthStateChange(
  async (_event, session) => {
    // ...fetches additional user data
  }
);
```

### 3. `src/lib/auth-utils.ts`

**Potential Issues**:
- Creates a new Supabase client for each auth operation
- Functions like `getCurrentUser()` make multiple Supabase calls

```typescript
export async function getCurrentUser(): Promise<UserProfile | null> {
  const supabase = await createClient();
  
  // Multiple API calls in sequence
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  // ...additional database query
}
```

### 4. `src/lib/auth/hooks.ts`

**Potential Issues**:
- Hooks that check permissions and auth status may trigger on every render
- `useEffect` dependencies might be causing unnecessary re-renders

### 5. `src/lib/supabase/client.ts` & `src/lib/supabase/server.ts`

**Design Issue**:
- Both files create new Supabase clients each time they're called
- No caching or reuse of clients

```typescript
// Client version
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Server version
export async function createClient() {
  const cookieStore = cookies();
  return createServerClient(/* ... */);
}
```

### 6. `src/lib/supabase/middleware.ts`

**Critical Issue**:
- This file is marked as deprecated but might still be imported somewhere
- If both middleware implementations are running simultaneously, it would double authentication requests

### 7. `src/app/layout.tsx`

**Observation**:
- Wraps the entire application in `AuthProvider`
- This is correct, but means auth context is initialized on every page

## Recommendations

### Immediate Fixes:

1. **Optimize Middleware**:
   - Add caching for auth sessions with a reasonable TTL (e.g., 5 minutes)
   - Only refresh tokens when absolutely necessary
   - Consider moving complex permission checks out of middleware

2. **Consolidate Supabase Client Creation**:
   - Implement a singleton pattern for Supabase clients
   - Cache client instances where possible

3. **Add Exponential Backoff**:
   - Implement retry logic with increasing delays for failed auth operations
   - Add circuit breakers to prevent cascading failures

4. **Check for Duplicate Auth Providers**:
   - Ensure there's only one `AuthProvider` in the application

### Long-term Solutions:

1. **Restructure Auth Flow**:
   - Consider using JWT with longer expiration for middleware checks
   - Use refresh tokens only when actually needed for operations

2. **Implement Better Caching**:
   - Cache permissions and user roles at the application level
   - Use stale-while-revalidate patterns for user data

3. **Optimize Route Protection**:
   - Move detailed permission checks out of the middleware
   - Only do basic auth verification in middleware

4. **Monitor Auth Operations**:
   - Add logging for auth operations to track frequency
   - Set up alerts for excessive auth requests

## Conclusion

The authentication issues stem primarily from middleware inefficiency and client creation patterns. Each request is creating new Supabase clients and triggering multiple auth operations. By implementing caching, optimizing middleware, and consolidating client creation, the application should dramatically reduce authentication requests and avoid rate limiting. 
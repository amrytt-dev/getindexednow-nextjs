# Centralized API Utility Guide

This guide explains how to use the new centralized API utility functions that handle authentication, error handling, and JSON parsing automatically.

## Overview

The `fetchWithAuth` utility provides a centralized way to make authenticated API calls with automatic error handling, token management, and response parsing.

## Basic Usage

### Import the utility functions

```typescript
import { 
  fetchWithAuth, 
  getWithAuth, 
  postWithAuth, 
  putWithAuth, 
  patchWithAuth, 
  deleteWithAuth,
  ApiError 
} from '@/utils/fetchWithAuth';
```

### Making GET requests

```typescript
// Simple GET request with authentication
const userProfile = await getWithAuth<UserProfile>('/user/profile');

// GET request without authentication (for public endpoints)
const plans = await getWithAuth<Plan[]>('/plans', { requireAuth: false });

// GET request with custom headers
const data = await getWithAuth<Data>('/endpoint', {
  headers: { 'Custom-Header': 'value' }
});
```

### Making POST requests

```typescript
// POST request with data
const result = await postWithAuth<ResponseType>('/user/subscription/change', {
  planId: 'plan_123',
  action: 'upgrade'
});

// POST request with custom options
const result = await postWithAuth<ResponseType>('/endpoint', data, {
  redirectOnUnauthorized: false
});
```

### Making other HTTP requests

```typescript
// PUT request
const updated = await putWithAuth<ResponseType>('/user/profile', {
  firstName: 'John',
  lastName: 'Doe'
});

// PATCH request
const patched = await patchWithAuth<ResponseType>('/user/settings', {
  notifications: true
});

// DELETE request
const deleted = await deleteWithAuth<ResponseType>('/user/data');
```

## Advanced Usage

### Using the base fetchWithAuth function

```typescript
// Custom request with full control
const result = await fetchWithAuth<ResponseType>('/custom-endpoint', {
  method: 'POST',
  body: JSON.stringify(data),
  headers: {
    'Custom-Header': 'value'
  },
  requireAuth: true,
  redirectOnUnauthorized: true
});
```

### Error handling

```typescript
try {
  const data = await getWithAuth<DataType>('/endpoint');
  // Handle success
} catch (error) {
  if (error instanceof ApiError) {
    console.log('API Error:', error.message);
    console.log('Status:', error.status);
    console.log('Status Text:', error.statusText);
  } else {
    console.log('Network Error:', error.message);
  }
}
```

### Handling FormData

```typescript
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const result = await fetchWithAuth<ResponseType>('/upload', {
  method: 'POST',
  body: formData
  // Content-Type header is automatically removed for FormData
});
```

## Configuration Options

### FetchWithAuthOptions

```typescript
interface FetchWithAuthOptions extends RequestInit {
  requireAuth?: boolean;           // Default: true
  redirectOnUnauthorized?: boolean; // Default: true
}
```

### requireAuth
- `true` (default): Automatically adds `Authorization: Bearer ${token}` header
- `false`: Skips authentication (useful for public endpoints)

### redirectOnUnauthorized
- `true` (default): Automatically redirects to `/auth` on 401 responses
- `false`: Throws ApiError instead of redirecting

## Automatic Features

### 1. Authentication
- Automatically retrieves token from `localStorage.getItem('token')`
- Adds `Authorization: Bearer ${token}` header when `requireAuth: true`
- Handles missing tokens gracefully

### 2. Error Handling
- Automatically handles 401 Unauthorized responses
- Parses error responses for meaningful error messages
- Throws custom `ApiError` with status information
- Handles network errors gracefully

### 3. Response Parsing
- Automatically parses JSON responses
- Falls back to text for non-JSON responses
- Handles empty responses

### 4. Base URL Management
- Uses `VITE_API_URL` environment variable
- Falls back to `http://localhost:3001` if not set
- Automatically prepends `/api` to endpoints

## Migration Guide

### Before (Old Pattern)

```typescript
const fetchData = async () => {
  try {
    const backendBaseUrl = import.meta.env.VITE_API_URL || '';
    const token = localStorage.getItem('token');
    
    const res = await fetch(`${backendBaseUrl}/api/user/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }
    
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
```

### After (New Pattern)

```typescript
const fetchData = async () => {
  try {
    const data = await getWithAuth<UserProfile>('/user/profile');
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
```

### Before (POST with data)

```typescript
const updateData = async (payload: any) => {
  try {
    const backendBaseUrl = import.meta.env.VITE_API_URL || '';
    const token = localStorage.getItem('token');
    
    const res = await fetch(`${backendBaseUrl}/api/user/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    
    if (!res.ok) {
      throw new Error('Failed to update data');
    }
    
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
```

### After (POST with data)

```typescript
const updateData = async (payload: any) => {
  try {
    const data = await postWithAuth<ResponseType>('/user/update', payload);
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
```

## Best Practices

### 1. Type Safety
Always specify the return type for better type safety:

```typescript
const user = await getWithAuth<UserProfile>('/user/profile');
const plans = await getWithAuth<Plan[]>('/plans', { requireAuth: false });
```

### 2. Error Handling
Use try-catch blocks and handle ApiError specifically:

```typescript
try {
  const data = await getWithAuth<DataType>('/endpoint');
} catch (error) {
  if (error instanceof ApiError) {
    // Handle API errors
    toast({
      title: 'Error',
      description: error.message,
      variant: 'destructive',
    });
  } else {
    // Handle network errors
    toast({
      title: 'Network Error',
      description: 'Please check your connection',
      variant: 'destructive',
    });
  }
}
```

### 3. Public Endpoints
Use `requireAuth: false` for public endpoints:

```typescript
const plans = await getWithAuth<Plan[]>('/plans', { requireAuth: false });
```

### 4. Custom Error Handling
Use `redirectOnUnauthorized: false` when you want to handle 401 errors manually:

```typescript
try {
  const data = await getWithAuth<DataType>('/endpoint', {
    redirectOnUnauthorized: false
  });
} catch (error) {
  if (error instanceof ApiError && error.status === 401) {
    // Handle unauthorized manually
    handleUnauthorized();
  }
}
```

## Examples

### User Profile Management

```typescript
// Get user profile
const profile = await getWithAuth<UserProfile>('/user/profile');

// Update user profile
const updated = await putWithAuth<UserProfile>('/user/profile', {
  firstName: 'John',
  lastName: 'Doe'
});

// Change password
await postWithAuth('/auth/change-password', {
  currentPassword: 'oldpass',
  newPassword: 'newpass'
});
```

### Subscription Management

```typescript
// Get current subscription
const subscription = await getWithAuth<Subscription>('/user/subscription');

// Change plan
const result = await postWithAuth<ChangePlanResponse>('/user/subscription/change', {
  planId: 'plan_123',
  action: 'upgrade'
});

// Get subscription history
const history = await getWithAuth<SubscriptionHistory>('/user/subscription/history');
```

### Task Management

```typescript
// Submit new task
const task = await postWithAuth<Task>('/proxy/speedyindex', {
  title: 'My Task',
  urls: ['https://example.com'],
  type: 'indexer',
  vipQueue: true
});

// Get tasks
const tasks = await getWithAuth<Task[]>('/tasks');
```

This centralized approach provides consistent error handling, authentication, and response parsing across your entire application while reducing boilerplate code significantly. 
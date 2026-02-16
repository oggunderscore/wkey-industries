<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/stores/authStore';
  import { userStore, isAdmin } from '$lib/stores/userStore';
  import { db } from '$lib/firebase';
  import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
  import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';

  let users = [];
  let loading = true;
  let error = '';
  let updating = null;
  let currentUserRole = null;
  let authInitialized = false;

  const roles = ['guest', 'user', 'admin'];

  onMount(() => {
    console.log('Admin panel mounted');
    
    authStore.init();
    
    const unsubscribe = authStore.subscribe(async (state) => {
      console.log('Auth state:', state);
      
      if (state.initialized) {
        authInitialized = true;
        
        if (!state.user) {
          console.log('No user, redirecting to login');
          goto('/login');
          return;
        }
        
        console.log('User authenticated:', state.user.uid);
        userStore.init(state.user.uid);
      }
    });

    const unsubscribeUser = userStore.subscribe(async (state) => {
      console.log('User store state:', state);
      currentUserRole = state.role;
      
      if (authInitialized && !state.loading) {
        if (state.role !== 'admin') {
          console.log('User is not admin, redirecting');
          goto('/');
          return;
        }
        
        console.log('User is admin, loading users');
        await loadUsers();
      }
    });

    return () => {
      unsubscribe();
      unsubscribeUser();
    };
  });

  async function loadUsers() {
    console.log('Loading users, db:', db);
    
    if (!db) {
      error = 'Database not initialized';
      loading = false;
      return;
    }
    
    loading = true;
    error = '';
    
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      console.log('Users snapshot size:', usersSnapshot.size);
      
      users = usersSnapshot.docs.map(doc => {
        const data = doc.data();
        console.log('User doc:', doc.id, data);
        return {
          id: doc.id,
          ...data
        };
      });
      
      console.log('Loaded users:', users);
    } catch (err) {
      error = 'Failed to load users: ' + err.message;
      console.error('Load users error:', err);
    } finally {
      loading = false;
    }
  }

  async function updateUserRole(userId, newRole) {
    if (!db) {
      error = 'Database not initialized';
      return;
    }
    
    updating = userId;
    error = '';
    
    try {
      await updateDoc(doc(db, 'users', userId), {
        role: newRole,
        updatedAt: new Date().toISOString()
      });
      
      users = users.map(u => 
        u.id === userId ? { ...u, role: newRole } : u
      );
      
      console.log('Updated user role:', userId, newRole);
    } catch (err) {
      error = 'Failed to update role: ' + err.message;
      console.error('Update role error:', err);
    } finally {
      updating = null;
    }
  }

</script>

<div class="admin-container">
  <div class="admin-header">
    <h1>Admin Panel</h1>
    <p>Manage user roles and permissions</p>
    <button class="btn btn-secondary" on:click={() => goto('/')}>
      Back to Home
    </button>
  </div>

  {#if loading}
    <div class="loading-wrapper">
      <LoadingSpinner size="large" text="Loading users..." />
    </div>
  {:else if error}
    <div class="error-message">{error}</div>
  {:else}
    <div class="users-table">
      <div class="table-header">
        <div class="col-email">Email</div>
        <div class="col-role">Role</div>
        <div class="col-created">Created</div>
        <div class="col-actions">Actions</div>
      </div>
      
      {#each users as user}
        <div class="table-row">
          <div class="col-email">{user.email}</div>
          <div class="col-role">
            <span class="role-badge role-{user.role}">{user.role}</span>
          </div>
          <div class="col-created">
            {new Date(user.createdAt).toLocaleDateString()}
          </div>
          <div class="col-actions">
            <select 
              value={user.role}
              on:change={(e) => updateUserRole(user.id, e.target.value)}
              disabled={updating === user.id}
              class="role-select"
            >
              {#each roles as role}
                <option value={role}>{role}</option>
              {/each}
            </select>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .admin-container {
    min-height: 100vh;
    padding: 40px 20px;
    background: var(--bg-primary);
  }

  .admin-header {
    max-width: 1200px;
    margin: 0 auto 40px;
    text-align: center;
  }

  .admin-header h1 {
    font-size: 2.5rem;
    color: var(--accent-primary);
    margin-bottom: 8px;
  }

  .admin-header p {
    color: var(--text-secondary);
    margin-bottom: 24px;
  }

  .loading-wrapper {
    display: flex;
    justify-content: center;
    padding: 60px 20px;
  }

  .error-message {
    max-width: 600px;
    margin: 0 auto;
    padding: 16px;
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.3);
    border-radius: 8px;
    color: #ef4444;
    text-align: center;
  }

  .users-table {
    max-width: 1200px;
    margin: 0 auto;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    overflow: hidden;
  }

  .table-header,
  .table-row {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1.5fr;
    gap: 16px;
    padding: 16px 24px;
    align-items: center;
  }

  .table-header {
    background: var(--bg-tertiary);
    border-bottom: 1px solid var(--border-color);
    font-weight: 600;
    color: var(--text-primary);
    font-size: 14px;
  }

  .table-row {
    border-bottom: 1px solid var(--border-color);
    transition: background 0.2s ease;
  }

  .table-row:last-child {
    border-bottom: none;
  }

  .table-row:hover {
    background: var(--hover-color);
  }

  .col-email {
    color: var(--text-primary);
    font-size: 14px;
  }

  .col-role,
  .col-created {
    color: var(--text-secondary);
    font-size: 14px;
  }

  .role-badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
    text-transform: uppercase;
  }

  .role-guest {
    background: rgba(136, 85, 255, 0.1);
    color: var(--accent-primary);
    border: 1px solid rgba(136, 85, 255, 0.3);
  }

  .role-user {
    background: rgba(59, 130, 246, 0.1);
    color: #3b82f6;
    border: 1px solid rgba(59, 130, 246, 0.3);
  }

  .role-admin {
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
    border: 1px solid rgba(239, 68, 68, 0.3);
  }

  .role-select {
    width: 100%;
    padding: 8px 12px;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 6px;
    color: var(--text-primary);
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .role-select:hover:not(:disabled) {
    border-color: var(--accent-primary);
  }

  .role-select:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    .table-header,
    .table-row {
      grid-template-columns: 1fr;
      gap: 8px;
    }

    .table-header {
      display: none;
    }

    .table-row {
      padding: 16px;
    }

    .col-email::before {
      content: 'Email: ';
      font-weight: 600;
      color: var(--text-secondary);
    }

    .col-created::before {
      content: 'Created: ';
      font-weight: 600;
      color: var(--text-secondary);
    }
  }
</style>

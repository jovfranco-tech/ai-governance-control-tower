/* eslint-disable react-refresh/only-export-components, react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase/client';
import { User, Session } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface UserOrganization {
  id: string;
  name: string;
  slug: string;
  billing_plan: 'free' | 'professional' | 'enterprise';
  created_at: string;
}

export interface OrgMembership {
  id: string;
  organization_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'governance_lead' | 'reviewer' | 'viewer';
  created_at: string;
  organization?: UserOrganization;
}

interface AuthContextType {
  user: User | { id: string; email: string } | null;
  profile: UserProfile | null;
  session: Session | null;
  activeOrg: UserOrganization | null;
  membership: OrgMembership | null;
  availableOrgs: UserOrganization[];
  isDemoMode: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<unknown>;
  signUp: (email: string, password: string, fullName: string) => Promise<unknown>;
  signOut: () => Promise<void>;
  switchOrganization: (orgId: string) => Promise<void>;
  activateDemoMode: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// High-fidelity Mock details for the Demo Fallback Mode
const MOCK_PROFILE: UserProfile = {
  id: 'demo-user-123',
  email: 'elena.rostova@enterprise-grc.demo',
  full_name: 'Elena Rostova',
  avatar_url: null,
  created_at: new Date().toISOString()
};

const MOCK_ORGS: UserOrganization[] = [
  {
    id: 'demo-org-alpha',
    name: 'Global AI Corp',
    slug: 'global-ai-corp',
    billing_plan: 'enterprise',
    created_at: new Date().toISOString()
  },
  {
    id: 'demo-org-beta',
    name: 'Strategic Ventures Ltd',
    slug: 'strategic-ventures',
    billing_plan: 'professional',
    created_at: new Date().toISOString()
  }
];

const MOCK_MEMBERSHIP: OrgMembership = {
  id: 'demo-member-123',
  organization_id: 'demo-org-alpha',
  user_id: 'demo-user-123',
  role: 'governance_lead',
  created_at: new Date().toISOString(),
  organization: MOCK_ORGS[0]
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | { id: string; email: string } | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [activeOrg, setActiveOrg] = useState<UserOrganization | null>(null);
  const [membership, setMembership] = useState<OrgMembership | null>(null);
  const [availableOrgs, setAvailableOrgs] = useState<UserOrganization[]>([]);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(!isSupabaseConfigured);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Setup local storage cache to persist Demo Mode selection
  useEffect(() => {
    const cachedDemoMode = localStorage.getItem('auth-demo-mode');
    if (!isSupabaseConfigured) {
      setIsDemoMode(true);
      setupMockSession();
      setIsLoading(false);
    } else if (cachedDemoMode === 'true') {
      setIsDemoMode(true);
      setupMockSession();
      setIsLoading(false);
    } else {
      // Supabase is configured, check active session
      initSupabaseAuth();
    }
  }, []);

  function setupMockSession() {
    setUser({ id: MOCK_PROFILE.id, email: MOCK_PROFILE.email });
    setProfile(MOCK_PROFILE);
    setSession(null);
    setAvailableOrgs(MOCK_ORGS);
    
    // Support switching mock organization
    const savedOrgId = localStorage.getItem('demo-active-org-id');
    const selectedOrg = MOCK_ORGS.find(o => o.id === savedOrgId) || MOCK_ORGS[0];
    setActiveOrg(selectedOrg);
    setMembership({
      ...MOCK_MEMBERSHIP,
      organization_id: selectedOrg.id,
      organization: selectedOrg
    });
  };

  async function initSupabaseAuth() {
    if (!supabase) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      if (session?.user) {
        setUser(session.user);
        await fetchUserProfileAndOrgs(session.user.id);
        setIsDemoMode(false);
      } else {
        // No session: let the user stay unauthenticated (they can choose Demo Mode on Auth Page)
        setUser(null);
        setProfile(null);
        setActiveOrg(null);
        setMembership(null);
      }
    } catch (err) {
      console.error('Failed to init Supabase auth. Falling back to Demo.', err);
      setIsDemoMode(true);
      setupMockSession();
    } finally {
      setIsLoading(false);
    }

    // Subscribe to auth state updates
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      setSession(newSession);
      if (newSession?.user) {
        setIsLoading(true);
        setUser(newSession.user);
        await fetchUserProfileAndOrgs(newSession.user.id);
        setIsDemoMode(false);
        setIsLoading(false);
      } else if (!isDemoMode) {
        // Only clear state if NOT explicitly in Demo Mode
        setUser(null);
        setProfile(null);
        setActiveOrg(null);
        setMembership(null);
        setAvailableOrgs([]);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  };

  async function fetchUserProfileAndOrgs(userId: string) {
    if (!supabase) return;
    try {
      // 1. Fetch Profile
      const { data: profileData, error: profileErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileErr) throw profileErr;
      setProfile(profileData);

      // 2. Fetch memberships joined with organization info
      const { data: membersData, error: membersErr } = await supabase
        .from('organization_members')
        .select('*, organization:organizations(*)')
        .eq('user_id', userId);

      if (membersErr) throw membersErr;

      if (membersData && membersData.length > 0) {
        const typedMembers = membersData as unknown as OrgMembership[];
        const orgs = typedMembers
          .map((m) => m.organization)
          .filter(Boolean) as UserOrganization[];
        
        setAvailableOrgs(orgs);
        
        // Select active org from local storage preference or default to first org
        const savedOrgId = localStorage.getItem(`active-org-id-${userId}`);
        const activeMember = typedMembers.find((m) => m.organization_id === savedOrgId) || typedMembers[0];
        
        setMembership({
          id: activeMember.id,
          organization_id: activeMember.organization_id,
          user_id: activeMember.user_id,
          role: activeMember.role,
          created_at: activeMember.created_at,
          organization: activeMember.organization
        });
        setActiveOrg(activeMember.organization || null);
      } else {
        // User is logged in but has no organizations. Let's auto-provision a default corporate organization
        const defaultOrgName = `${profileData.full_name || 'My'} Workspace`;
        const slug = defaultOrgName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        
        const { data: newOrg, error: orgErr } = await supabase
          .from('organizations')
          .insert({ name: defaultOrgName, slug, billing_plan: 'enterprise' })
          .select()
          .single();

        if (orgErr) throw orgErr;

        // Make them the owner
        const { data: newMember, error: memberErr } = await supabase
          .from('organization_members')
          .insert({ organization_id: newOrg.id, user_id: userId, role: 'owner' })
          .select('*, organization:organizations(*)')
          .single();

        if (memberErr) throw memberErr;

        setAvailableOrgs([newOrg]);
        setActiveOrg(newOrg);
        setMembership({
          id: newMember.id,
          organization_id: newMember.organization_id,
          user_id: newMember.user_id,
          role: newMember.role,
          created_at: newMember.created_at,
          organization: newOrg
        });
      }
    } catch (err) {
      console.error('Failed to load profile or workspaces:', err);
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!supabase) throw new Error('Supabase client is not configured.');
    setIsLoading(true);
    setIsDemoMode(false);
    localStorage.removeItem('auth-demo-mode');
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data;
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    if (!supabase) throw new Error('Supabase client is not configured.');
    setIsLoading(true);
    setIsDemoMode(false);
    localStorage.removeItem('auth-demo-mode');
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });
      if (error) throw error;
      
      // The trigger in PostgreSQL schema will auto-create the Profile in the database.
      return data;
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  };

  const signOut = async () => {
    if (isDemoMode) {
      setIsDemoMode(false);
      localStorage.removeItem('auth-demo-mode');
      setUser(null);
      setProfile(null);
      setActiveOrg(null);
      setMembership(null);
      setAvailableOrgs([]);
      return;
    }

    if (supabase) {
      setIsLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      setActiveOrg(null);
      setMembership(null);
      setAvailableOrgs([]);
      setIsLoading(false);
    }
  };

  const switchOrganization = async (orgId: string) => {
    if (isDemoMode) {
      const org = MOCK_ORGS.find(o => o.id === orgId);
      if (org) {
        localStorage.setItem('demo-active-org-id', orgId);
        setActiveOrg(org);
        setMembership({
          ...MOCK_MEMBERSHIP,
          organization_id: org.id,
          organization: org
        });
      }
      return;
    }

    if (!supabase || !user) return;
    setIsLoading(true);
    try {
      const { data: memberData, error } = await supabase
        .from('organization_members')
        .select('*, organization:organizations(*)')
        .eq('user_id', user.id)
        .eq('organization_id', orgId)
        .single();

      if (error) throw error;

      localStorage.setItem(`active-org-id-${user.id}`, orgId);
      setMembership({
        id: memberData.id,
        organization_id: memberData.organization_id,
        user_id: memberData.user_id,
        role: memberData.role,
        created_at: memberData.created_at,
        organization: memberData.organization
      });
      setActiveOrg(memberData.organization);
    } catch (err) {
      console.error('Failed to switch workspace organization:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const activateDemoMode = () => {
    setIsDemoMode(true);
    localStorage.setItem('auth-demo-mode', 'true');
    setupMockSession();
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      session,
      activeOrg,
      membership,
      availableOrgs,
      isDemoMode,
      isLoading,
      signIn,
      signUp,
      signOut,
      switchOrganization,
      activateDemoMode
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

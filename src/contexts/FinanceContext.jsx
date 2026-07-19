import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import localforage from 'localforage';
import { dictionaries } from '../data/i18n';
import { initialState } from '../data/seed';
import { uid } from '../utils/formatters';

const STORAGE_KEY = 'casa-clara-data';
const FinanceContext = createContext(null);
const DEFAULT_FAMILY_ID = 'family-1';
const DEFAULT_USER_ID = 'user-1';

localforage.config({
  name: 'CasaClara',
  storeName: 'finance'
});

function normalizeState(saved) {
  const merged = { ...initialState, ...(saved || {}) };
  const users = merged.users?.length
    ? merged.users
    : [
        { id: DEFAULT_USER_ID, name: merged.profile?.coupleName?.split(' e ')?.[0] || 'Usuario principal', email: 'usuario@casaclara.local' }
      ];
  const activeUserId = merged.activeUserId || users[0].id;
  const families = merged.families?.length
    ? merged.families
    : [
        {
          id: DEFAULT_FAMILY_ID,
          name: merged.profile?.coupleName ? `Familia ${merged.profile.coupleName}` : 'Minha Familia',
          ownerId: activeUserId,
          currency: merged.profile?.currency || 'BRL',
          language: merged.profile?.language || 'pt'
        }
      ];
  const activeFamilyId = merged.activeFamilyId || families[0].id;
  const memberships = merged.memberships?.length
    ? merged.memberships
    : users.map((user, index) => ({
        id: `member-${index + 1}`,
        familyId: activeFamilyId,
        userId: user.id,
        role: index === 0 ? 'owner' : 'member'
      }));

  return {
    ...merged,
    users,
    families,
    memberships,
    invitations: merged.invitations || [],
    activeUserId,
    activeFamilyId,
    accounts: merged.accounts.map((account) => ({ familyId: activeFamilyId, ...account })),
    transactions: merged.transactions.map((transaction) => ({ familyId: activeFamilyId, userId: activeUserId, ...transaction })),
    budgets: merged.budgets.map((budget) => ({
      familyId: activeFamilyId,
      assignedUserId: activeUserId,
      name: budget.name || budget.category,
      ...budget
    })),
    goals: merged.goals.map((goal) => ({ familyId: activeFamilyId, ...goal }))
  };
}

export function FinanceProvider({ children }) {
  const [state, setState] = useState(initialState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    localforage.getItem(STORAGE_KEY).then((saved) => {
      setState(normalizeState(saved));
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!loading) {
      localforage.setItem(STORAGE_KEY, state);
      document.documentElement.classList.toggle('dark', state.profile.theme === 'dark');
    }
  }, [loading, state]);

  const updateState = (patch) => setState((current) => ({ ...current, ...patch }));
  const updateProfile = (patch) =>
    setState((current) => ({
      ...current,
      profile: { ...current.profile, ...patch },
      families: current.families.map((family) =>
        family.id === current.activeFamilyId
          ? {
              ...family,
              name: patch.coupleName ?? family.name,
              currency: patch.currency ?? family.currency,
              language: patch.language ?? family.language
            }
          : family
      )
    }));

  const completeSetup = ({ userName, userEmail, familyName, currency, language }) => {
    const userId = uid('user');
    const familyId = uid('family');
    setState((current) => ({
      ...current,
      setupComplete: true,
      activeUserId: userId,
      activeFamilyId: familyId,
      profile: {
        ...current.profile,
        coupleName: familyName,
        currency,
        language
      },
      users: [{ id: userId, name: userName, email: userEmail || `${userName.toLowerCase().replaceAll(' ', '.')}@casaclara.local` }],
      families: [{ id: familyId, name: familyName, ownerId: userId, currency, language }],
      memberships: [{ id: uid('member'), familyId, userId, role: 'owner' }],
      invitations: [],
      accounts: current.accounts.map((account) => ({ ...account, familyId })),
      transactions: current.transactions.map((transaction) => ({ ...transaction, familyId, userId: transaction.userId || userId })),
      budgets: current.budgets.map((budget) => ({ ...budget, familyId, assignedUserId: budget.assignedUserId || userId })),
      goals: current.goals.map((goal) => ({ ...goal, familyId }))
    }));
  };

  const addTransaction = (transaction) => {
    setState((current) => ({
      ...current,
      transactions: [{ ...transaction, id: uid('t'), familyId: current.activeFamilyId, userId: current.activeUserId, value: Number(transaction.value) }, ...current.transactions]
    }));
  };

  const updateTransaction = (id, transaction) => {
    setState((current) => ({
      ...current,
      transactions: current.transactions.map((item) => (item.id === id ? { ...transaction, id, value: Number(transaction.value) } : item))
    }));
  };

  const deleteTransaction = (id) => {
    setState((current) => ({
      ...current,
      transactions: current.transactions.filter((transaction) => transaction.id !== id)
    }));
  };

  const addBudget = (budget) => {
    setState((current) => ({
      ...current,
      budgets: [...current.budgets, { ...budget, id: uid('b'), familyId: current.activeFamilyId, limit: Number(budget.limit) }]
    }));
  };

  const addGoal = (goal) => {
    setState((current) => ({
      ...current,
      goals: [...current.goals, { ...goal, id: uid('g'), familyId: current.activeFamilyId, target: Number(goal.target), current: Number(goal.current) }]
    }));
  };

  const addAccount = (account) => {
    setState((current) => ({
      ...current,
      accounts: [...current.accounts, { ...account, id: uid('acc'), familyId: current.activeFamilyId, balance: Number(account.balance) }]
    }));
  };

  const switchUser = (userId) => {
    setState((current) => {
      const availableFamilies = current.memberships.filter((member) => member.userId === userId);
      const stillInActiveFamily = availableFamilies.some((member) => member.familyId === current.activeFamilyId);
      return {
        ...current,
        activeUserId: userId,
        activeFamilyId: stillInActiveFamily ? current.activeFamilyId : availableFamilies[0]?.familyId || current.activeFamilyId
      };
    });
  };

  const switchFamily = (familyId) => setState((current) => ({ ...current, activeFamilyId: familyId }));

  const createFamily = ({ name, currency, language }) => {
    setState((current) => {
      const familyId = uid('family');
      return {
        ...current,
        activeFamilyId: familyId,
        families: [...current.families, { id: familyId, name, ownerId: current.activeUserId, currency, language }],
        memberships: [...current.memberships, { id: uid('member'), familyId, userId: current.activeUserId, role: 'owner' }]
      };
    });
  };

  const inviteMember = ({ name, email }) => {
    setState((current) => ({
      ...current,
      invitations: [
        ...current.invitations,
        { id: uid('invite'), familyId: current.activeFamilyId, invitedBy: current.activeUserId, name, email, status: 'pending' }
      ]
    }));
  };

  const acceptInvitation = (invitationId) => {
    setState((current) => {
      const invitation = current.invitations.find((item) => item.id === invitationId);
      if (!invitation) return current;
      const existingUser = current.users.find((user) => user.email === invitation.email);
      const user = existingUser || { id: uid('user'), name: invitation.name, email: invitation.email };
      const alreadyMember = current.memberships.some((member) => member.familyId === invitation.familyId && member.userId === user.id);
      return {
        ...current,
        activeUserId: user.id,
        activeFamilyId: invitation.familyId,
        users: existingUser ? current.users : [...current.users, user],
        memberships: alreadyMember
          ? current.memberships
          : [...current.memberships, { id: uid('member'), familyId: invitation.familyId, userId: user.id, role: 'member' }],
        invitations: current.invitations.map((item) => (item.id === invitationId ? { ...item, status: 'accepted', acceptedUserId: user.id } : item))
      };
    });
  };

  const restoreData = (data) => setState(normalizeState(data));
  const resetData = () => setState(normalizeState(initialState));

  const value = useMemo(() => {
    const activeFamily = state.families.find((family) => family.id === state.activeFamilyId) || state.families[0];
    const activeUser = state.users.find((user) => user.id === state.activeUserId) || state.users[0];
    const familyMembers = state.memberships
      .filter((member) => member.familyId === activeFamily?.id)
      .map((member) => ({ ...member, user: state.users.find((user) => user.id === member.userId) }))
      .filter((member) => member.user);
    const activeMembership = familyMembers.find((member) => member.userId === activeUser?.id);
    const userFamilies = state.memberships
      .filter((member) => member.userId === activeUser?.id)
      .map((member) => state.families.find((family) => family.id === member.familyId))
      .filter(Boolean);
    const language = activeFamily?.language || state.profile.language || 'pt';
    return {
      ...state,
      rawState: state,
      profile: {
        ...state.profile,
        coupleName: activeFamily?.name || state.profile.coupleName,
        currency: activeFamily?.currency || state.profile.currency,
        language
      },
      activeFamily,
      activeUser,
      activeMembership,
      familyMembers,
      userFamilies,
      accounts: state.accounts.filter((account) => account.familyId === activeFamily?.id),
      transactions: state.transactions.filter((transaction) => transaction.familyId === activeFamily?.id),
      budgets: state.budgets.filter((budget) => budget.familyId === activeFamily?.id),
      goals: state.goals.filter((goal) => goal.familyId === activeFamily?.id),
      loading,
      t: dictionaries[language] || dictionaries.pt,
      updateState,
      updateProfile,
      completeSetup,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      addBudget,
      addGoal,
      addAccount,
      switchUser,
      switchFamily,
      createFamily,
      inviteMember,
      acceptInvitation,
      restoreData,
      resetData
    };
  }, [loading, state]);

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) throw new Error('useFinance must be used inside FinanceProvider');
  return context;
}

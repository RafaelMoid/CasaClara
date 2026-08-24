export const categories = {
  income: ['Salario', 'Freelance', 'Investimentos', 'Presente'],
  expense: ['Moradia', 'Alimentacao', 'Transporte', 'Lazer', 'Saude', 'Educacao', 'Internet']
};

export const paymentMethods = ['Debito', 'Credito', 'Pix', 'Dinheiro', 'Transferencia'];

export const initialState = {
  setupComplete: false,
  termsAccepted: false,
  activeUserId: 'user-1',
  activeFamilyId: 'family-1',
  profile: {
    coupleName: 'Joao e Maria',
    currency: 'BRL',
    language: 'pt',
    theme: 'system'
  },
  users: [
    { id: 'user-1', name: 'Joao', email: 'joao@casaclara.local' },
    { id: 'user-2', name: 'Maria', email: 'maria@casaclara.local' }
  ],
  families: [
    { id: 'family-1', name: 'Familia Joao e Maria', ownerId: 'user-1', currency: 'BRL', language: 'pt' }
  ],
  memberships: [
    { id: 'member-1', familyId: 'family-1', userId: 'user-1', role: 'owner' },
    { id: 'member-2', familyId: 'family-1', userId: 'user-2', role: 'member' }
  ],
  invitations: [],
  accounts: [
    { id: 'acc-1', familyId: 'family-1', name: 'Conta Conjunta', type: 'Conta corrente', balance: 4250 },
    { id: 'acc-2', familyId: 'family-1', name: 'Poupanca', type: 'Reserva', balance: 8200 },
    { id: 'acc-3', familyId: 'family-1', name: 'Cartao de Credito', type: 'Fatura atual', balance: -1250 },
    { id: 'acc-4', familyId: 'family-1', name: 'Dinheiro', type: 'Carteira', balance: 150 }
  ],
  transactions: [
    { id: 't-1', familyId: 'family-1', userId: 'user-1', type: 'income', category: 'Salario', description: 'Salario', value: 5000, date: '2026-07-13', account: 'Conta Conjunta', paymentMethod: 'Transferencia', recurring: true },
    { id: 't-2', familyId: 'family-1', userId: 'user-2', type: 'income', category: 'Freelance', description: 'Projeto website', value: 1200, date: '2026-07-12', account: 'Poupanca', paymentMethod: 'Pix', recurring: false },
    { id: 't-3', type: 'expense', category: 'Alimentacao', description: 'Supermercado', value: 245, date: '2026-07-12', account: 'Conta Conjunta', paymentMethod: 'Debito', recurring: false },
    { id: 't-4', type: 'expense', category: 'Moradia', description: 'Aluguel', value: 1800, date: '2026-07-11', account: 'Conta Conjunta', paymentMethod: 'Transferencia', recurring: true },
    { id: 't-5', type: 'expense', category: 'Transporte', description: 'Combustivel', value: 180, date: '2026-07-11', account: 'Conta Conjunta', paymentMethod: 'Credito', recurring: false },
    { id: 't-6', type: 'expense', category: 'Internet', description: 'Internet', value: 120, date: '2026-07-10', account: 'Conta Conjunta', paymentMethod: 'Debito', recurring: true },
    { id: 't-7', type: 'expense', category: 'Alimentacao', description: 'Restaurante', value: 98.5, date: '2026-07-10', account: 'Conta Conjunta', paymentMethod: 'Credito', recurring: false },
    { id: 't-8', type: 'expense', category: 'Lazer', description: 'Cinema', value: 60, date: '2026-07-09', account: 'Conta Conjunta', paymentMethod: 'Pix', recurring: false },
    { id: 't-9', type: 'income', category: 'Investimentos', description: 'Rendimento poupanca', value: 82.4, date: '2026-07-09', account: 'Poupanca', paymentMethod: 'Transferencia', recurring: false },
    { id: 't-10', type: 'expense', category: 'Saude', description: 'Farmacia', value: 74.9, date: '2026-07-08', account: 'Conta Conjunta', paymentMethod: 'Debito', recurring: false },
    { id: 't-11', type: 'expense', category: 'Transporte', description: 'Aplicativo de transporte', value: 38.2, date: '2026-07-08', account: 'Conta Conjunta', paymentMethod: 'Credito', recurring: false },
    { id: 't-12', type: 'expense', category: 'Alimentacao', description: 'Padaria', value: 31.8, date: '2026-07-07', account: 'Conta Conjunta', paymentMethod: 'Debito', recurring: false },
    { id: 't-13', type: 'expense', category: 'Educacao', description: 'Curso online', value: 89.9, date: '2026-07-07', account: 'Cartao de Credito', paymentMethod: 'Credito', recurring: false },
    { id: 't-14', type: 'expense', category: 'Moradia', description: 'Condominio', value: 520, date: '2026-07-06', account: 'Conta Conjunta', paymentMethod: 'Transferencia', recurring: true },
    { id: 't-15', type: 'expense', category: 'Alimentacao', description: 'Feira', value: 115.3, date: '2026-07-06', account: 'Conta Conjunta', paymentMethod: 'Pix', recurring: false },
    { id: 't-16', type: 'expense', category: 'Lazer', description: 'Assinatura streaming', value: 39.9, date: '2026-07-05', account: 'Cartao de Credito', paymentMethod: 'Credito', recurring: true },
    { id: 't-17', type: 'income', category: 'Presente', description: 'Presente familia', value: 300, date: '2026-07-05', account: 'Poupanca', paymentMethod: 'Pix', recurring: false },
    { id: 't-18', type: 'expense', category: 'Internet', description: 'Celular', value: 79.9, date: '2026-07-04', account: 'Conta Conjunta', paymentMethod: 'Debito', recurring: true },
    { id: 't-19', type: 'expense', category: 'Transporte', description: 'Estacionamento', value: 25, date: '2026-07-04', account: 'Conta Conjunta', paymentMethod: 'Dinheiro', recurring: false },
    { id: 't-20', type: 'expense', category: 'Alimentacao', description: 'Mercado rapido', value: 62.7, date: '2026-07-03', account: 'Conta Conjunta', paymentMethod: 'Debito', recurring: false },
    { id: 't-21', type: 'expense', category: 'Saude', description: 'Consulta', value: 180, date: '2026-07-03', account: 'Conta Conjunta', paymentMethod: 'Pix', recurring: false },
    { id: 't-22', type: 'expense', category: 'Lazer', description: 'Cafe no parque', value: 42.5, date: '2026-07-02', account: 'Conta Conjunta', paymentMethod: 'Debito', recurring: false },
    { id: 't-23', type: 'expense', category: 'Moradia', description: 'Produtos de limpeza', value: 96.4, date: '2026-07-02', account: 'Conta Conjunta', paymentMethod: 'Credito', recurring: false },
    { id: 't-24', type: 'expense', category: 'Educacao', description: 'Livro', value: 54.9, date: '2026-07-01', account: 'Conta Conjunta', paymentMethod: 'Pix', recurring: false }
  ],
  budgets: [
    { id: 'b-1', familyId: 'family-1', assignedUserId: 'user-2', name: 'Mercado e refeicoes', category: 'Alimentacao', limit: 1200 },
    { id: 'b-2', familyId: 'family-1', assignedUserId: 'user-1', name: 'Transporte do mes', category: 'Transporte', limit: 600 },
    { id: 'b-3', familyId: 'family-1', assignedUserId: 'user-2', name: 'Lazer do casal', category: 'Lazer', limit: 500 },
    { id: 'b-4', familyId: 'family-1', assignedUserId: 'user-1', name: 'Saude e farmacia', category: 'Saude', limit: 400 }
  ],
  goals: [
    { id: 'g-1', familyId: 'family-1', name: 'Viagem Europa', target: 10000, current: 4250, date: '2027-03-20' },
    { id: 'g-2', familyId: 'family-1', name: 'Casa Propria', target: 50000, current: 12500, date: '2028-12-01' },
    { id: 'g-3', familyId: 'family-1', name: 'Reserva de Emergencia', target: 20000, current: 8750, date: '2027-01-15' }
  ]
};

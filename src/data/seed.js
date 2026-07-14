export const categories = {
  income: ['Salario', 'Freelance', 'Investimentos', 'Presente'],
  expense: ['Moradia', 'Alimentacao', 'Transporte', 'Lazer', 'Saude', 'Educacao', 'Internet']
};

export const paymentMethods = ['Debito', 'Credito', 'Pix', 'Dinheiro', 'Transferencia'];

export const initialState = {
  setupComplete: false,
  termsAccepted: false,
  profile: {
    coupleName: 'Joao e Maria',
    currency: 'BRL',
    language: 'pt',
    theme: 'light'
  },
  accounts: [
    { id: 'acc-1', name: 'Conta Conjunta', type: 'Conta corrente', balance: 4250 },
    { id: 'acc-2', name: 'Poupanca', type: 'Reserva', balance: 8200 },
    { id: 'acc-3', name: 'Cartao de Credito', type: 'Fatura atual', balance: -1250 },
    { id: 'acc-4', name: 'Dinheiro', type: 'Carteira', balance: 150 }
  ],
  transactions: [
    { id: 't-1', type: 'income', category: 'Salario', description: 'Salario', value: 5000, date: '2026-07-10', account: 'Conta Conjunta', paymentMethod: 'Transferencia', recurring: true },
    { id: 't-2', type: 'income', category: 'Freelance', description: 'Projeto website', value: 1200, date: '2026-07-08', account: 'Poupanca', paymentMethod: 'Pix', recurring: false },
    { id: 't-3', type: 'expense', category: 'Alimentacao', description: 'Supermercado', value: 245, date: '2026-07-12', account: 'Conta Conjunta', paymentMethod: 'Debito', recurring: false },
    { id: 't-4', type: 'expense', category: 'Moradia', description: 'Aluguel', value: 1800, date: '2026-07-05', account: 'Conta Conjunta', paymentMethod: 'Transferencia', recurring: true },
    { id: 't-5', type: 'expense', category: 'Transporte', description: 'Combustivel', value: 180, date: '2026-07-11', account: 'Conta Conjunta', paymentMethod: 'Credito', recurring: false },
    { id: 't-6', type: 'expense', category: 'Internet', description: 'Internet', value: 120, date: '2026-07-09', account: 'Conta Conjunta', paymentMethod: 'Debito', recurring: true }
  ],
  budgets: [
    { id: 'b-1', category: 'Alimentacao', limit: 1200 },
    { id: 'b-2', category: 'Transporte', limit: 600 },
    { id: 'b-3', category: 'Lazer', limit: 500 },
    { id: 'b-4', category: 'Saude', limit: 400 }
  ],
  goals: [
    { id: 'g-1', name: 'Viagem Europa', target: 10000, current: 4250, date: '2027-03-20' },
    { id: 'g-2', name: 'Casa Propria', target: 50000, current: 12500, date: '2028-12-01' },
    { id: 'g-3', name: 'Reserva de Emergencia', target: 20000, current: 8750, date: '2027-01-15' }
  ]
};

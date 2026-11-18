/** Coincide con el enum transaction_type de la base de datos. */
export type TransactionType = 'income' | 'expense';

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
}

/** Transacción tal como la usa la UI: con su categoría incluida. */
export interface Transaction {
  id: string;
  amount: number;
  description: string | null;
  /** Formato 'YYYY-MM-DD', igual que la columna date de Postgres. */
  date: string;
  category: Category;
}

/** Datos que envía el formulario para crear o editar. */
export interface TransactionInput {
  amount: number;
  description: string | null;
  date: string;
  category_id: string;
}

/** Filtro activo de período. month va de 1 a 12. */
export interface MonthFilter {
  month: number;
  year: number;
}   

/** Datos del usuario que le interesan a la UI. */
export interface AuthUser {
  id: string;
  email: string | null;
  isAnonymous: boolean;
}
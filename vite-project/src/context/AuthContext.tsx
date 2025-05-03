// import { Children, createContext} from 'react'
// import { User } from '@supabase/supabase-js'

// interface AuthContextType {
//     user: User | null;
//     signIn: () => void;
//     signOut: () => void;
// }

// /*user: bisa berisi data user, atau null kalau blm login
// signIn: fungsi untuk login
// signOut: fungsi untuk logout*/

// const AuthContext = createContext<AuthContextType|undefined>(undefined)

// /*AuthContext, dan awalnya nilainya undefined.
// Kita kasih tahu bahwa nilai yang nanti akan disimpan di dalamnya harus cocok dengan struktur AuthContextType*/

// export const AuthProvider ({Children}: {Children: React.ReactNode}) {


//     return <AuthContext.Provider value={undefined}>
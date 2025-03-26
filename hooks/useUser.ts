import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { UserRow } from '@/supabase/supabase-helpers'

// Créer une seule instance du client Supabase
const supabase = createClient()

export function useUser() {
    const [user, setUser] = useState<any | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function getUser() {
            try {
                console.log("Vérification de l'authentification...")
                const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
                
                if (authError) {
                    console.error("Erreur d'authentification:", authError)
                    setUser(null)
                    return
                }

                if (!authUser) {
                    console.log("Aucun utilisateur authentifié")
                    setUser(null)
                    return
                }

                console.log("Utilisateur authentifié:", authUser.id)
                
        

                console.log("Données utilisateur récupérées:", authUser)
                setUser(authUser)
            } catch (error) {
                console.error('Erreur inattendue:', error)
                setUser(null)
            } finally {
                setLoading(false)
            }
        }
       getUser()

    }, [])

    return { user, loading }
} 
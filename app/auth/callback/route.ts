import { NextResponse } from 'next/server'
// The client you created from the Server-Side Auth instructions
import { createClientForServer } from '@/utils/supabase/server'

export async function GET(request: Request) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    
    // Récupérer le paramètre next s'il existe, sinon rediriger vers la racine
    const next = requestUrl.searchParams.get('next') ?? '/'

    if (code) {
        const supabase = await createClientForServer()
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        
        if (!error) {
            // Gérer la redirection en tenant compte de l'environnement
            const forwardedHost = request.headers.get('x-forwarded-host')
            const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
            const host = forwardedHost ?? requestUrl.host
            const baseUrl = `${protocol}://${host}`
            
            // Rediriger vers la page demandée ou la racine
            return NextResponse.redirect(`${baseUrl}${next}`)
        }
    }

    // En cas d'erreur, rediriger vers la page d'erreur
    return NextResponse.redirect(`${requestUrl.origin}/auth/auth-code-error`)
}
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
        const { error, data } = await supabase.auth.exchangeCodeForSession(code)
        
        if (!error && data.session) {
            // Créer la réponse de redirection
            const response = NextResponse.redirect(new URL(next, requestUrl.origin))
            
            // Définir les cookies de session
            response.cookies.set('sb-access-token', data.session.access_token, {
                path: '/',
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 7 // 7 jours
            })
            
            response.cookies.set('sb-refresh-token', data.session.refresh_token, {
                path: '/',
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 7 // 7 jours
            })
            
            return response
        }
    }

    // En cas d'erreur, rediriger vers la page d'erreur
    return NextResponse.redirect(new URL('/auth/auth-code-error', requestUrl.origin))
}
import { SupabaseClient } from "@supabase/supabase-js";


export const listUserVideos = async (
    supabase: SupabaseClient,
    userId: string | undefined,
    options: {
        limit?: number;
        offset?: number;
    } = {}
): Promise<{files: any[], error: any}> => {

console.log('userId', userId);
    const { data: files, error } = await supabase
        .storage
        .from('videos')
        .list(`${userId}/`, {
            limit: options.limit || 100,
            offset: options.offset || 0,
            sortBy: { column: 'name', order: 'desc' }
        });

    console.log('Files récupérés:', files);
    return { files: files || [], error };
};
import { supabase } from '../lib/supabase';

export async function getServerSideProps({ params }) {
  const { code } = params;

  const { data } = await supabase
    .from('links')
    .select('original_url')
    .eq('short_code', code)
    .single();

  if (!data) {
    return {
      notFound: true,
    };
  }

  return {
    redirect: {
      destination: data.original_url,
      permanent: false,
    },
  };
}

export default function RedirectPage() {
  return null;
}

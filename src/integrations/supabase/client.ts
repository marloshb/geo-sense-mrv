// Demo-only stub. The app no longer depends on Lovable Cloud / Supabase.
// This mock preserves the small API surface used by the UI so components
// keep working with static/mocked responses (they already have fallbacks).

type InvokeResult = { data: any; error: null };

async function invoke(name: string, opts?: { body?: any }): Promise<InvokeResult> {
  const type = opts?.body?.type;
  // Return sensible empty payloads; components already display fallback content.
  if (name === "calculate-emissions") {
    return { data: { summary: undefined }, error: null };
  }
  if (name === "mrv-ai-insights") {
    if (type === "generate_insights") {
      return { data: { result: { insights: [] } }, error: null };
    }
    if (type === "executive_summary") {
      return { data: { summary: undefined }, error: null };
    }
    return { data: { result: {} }, error: null };
  }
  return { data: {}, error: null };
}

function table(_name: string) {
  return {
    insert: async (_row: any) => ({ error: null }),
    select: async () => ({ data: [], error: null }),
    update: async (_row: any) => ({ error: null }),
    delete: async () => ({ error: null }),
  };
}

export const supabase = {
  functions: { invoke },
  from: table,
  auth: {
    async getSession() {
      return { data: { session: null }, error: null };
    },
    async getUser() {
      return { data: { user: null }, error: null };
    },
    onAuthStateChange(_cb: any) {
      return { data: { subscription: { unsubscribe() {} } } };
    },
    async signOut() {
      return { error: null };
    },
  },
};
import { createFileRoute, Link } from "@tanstack/react-router";
import { apiRequest, useApi } from "@/lib/api";
import { RequireAuth } from "@/components/RequireAuth";
import { useRbac } from "@/lib/use-rbac";

type Access = {
  users: Array<{
    id: string;
    name: string;
    email: string;
    state: string;
    roleIds: string[];
  }>;
  roles: Array<{ id: string; key: string; name: string }>;
};

export const Route = createFileRoute("/admin/access")({
  component: () => (
    <RequireAuth>
      <AccessAdmin />
    </RequireAuth>
  ),
});

function AccessAdmin() {
  const { data: rbac } = useRbac();
  const query = useApi<Access>("/admin/access");

  if (rbac && !rbac.isSuperAdmin) {
    return (
      <section className="mx-auto max-w-2xl px-5 py-24 text-center">
        <p className="eyebrow text-red-600">Access Restricted</p>
        <h1 className="font-display mt-3 text-3xl font-bold">Super Administrator Required</h1>
        <p className="mt-4 text-sm leading-6 text-ink/70">
          User access control and role governance can only be accessed by Super Administrators.
        </p>
        <Link
          to="/account"
          className="mt-8 inline-block rounded-full bg-ink px-6 py-3 text-sm font-bold text-white hover:bg-ink/90 transition"
        >
          View Account Settings
        </Link>
      </section>
    );
  }

  async function assign(userId: string, roleId: string) {
    if (!roleId) return;
    await apiRequest(`/admin/users/${userId}/roles/${roleId}`, {
      method: "POST",
    });
    await query.reload();
  }
  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <p className="eyebrow text-leaf">Super administrator</p>
      <h1 className="font-display mt-4 text-4xl font-bold">
        Access management
      </h1>
      {query.loading && <p className="mt-8">Loading access records...</p>}
      {query.error && (
        <p role="alert" className="mt-8">
          {query.error}
        </p>
      )}
      <div className="mt-8 space-y-3">
        {query.data?.users.map((user) => (
          <div
            key={user.id}
            className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center"
          >
            <div className="flex-1">
              <p className="font-bold">{user.name}</p>
              <p className="text-sm text-ink/50">
                {user.email} · {user.state}
              </p>
              <p className="mt-1 text-xs text-ink/40">
                {query.data?.roles
                  .filter((r) => user.roleIds.includes(r.id))
                  .map((r) => r.name)
                  .join(", ") || "No role"}
              </p>
            </div>
            <select
              aria-label={`Assign role to ${user.name}`}
              defaultValue=""
              onChange={(e) => void assign(user.id, e.target.value)}
              className="rounded-xl border px-3 py-2 text-sm"
            >
              <option value="" disabled>
                Assign role
              </option>
              {query.data?.roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </section>
  );
}

import ConfirmModal from "../../ui/modals/ConfirmModal";
import useLogout from "../../../hooks/useLogout";

function UserInfo({ user }) {
  const {
    isConfirmOpen,
    requestLogout,
    cancelLogout,
    confirmLogout,
    isLoading,
  } = useLogout();

  return (
    <div className="h-fit rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-bold text-stone-800">Profile</h2>

      {user ? (
        <div className="space-y-3 text-sm text-stone-700">
          <p>
            <span className="font-semibold text-stone-500">Email</span>
            <br />
            {user.email}
          </p>

          <p>
            <span className="font-semibold text-stone-500">Name</span>
            <br />
            {user.displayName || "—"}
          </p>

          <button
            onClick={requestLogout}
            disabled={isLoading}
            className="mt-6 w-full rounded-xl border border-stone-300 py-2 text-sm font-semibold text-stone-700 transition hover:bg-stone-100 disabled:opacity-50"
          >
            Log out
          </button>
        </div>
      ) : (
        <p className="text-sm text-stone-500">Loading user info…</p>
      )}

      <ConfirmModal
        open={isConfirmOpen}
        title="Log out"
        description="Are you sure you want to log out?"
        cancelButtonText="Cancel"
        confirmButtonText="Log out"
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
      />
    </div>
  );
}

export default UserInfo;

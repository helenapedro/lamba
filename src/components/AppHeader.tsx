interface AppHeaderUser {
  photoURL: string | null
  displayName: string | null
  email: string | null
}

interface Props {
  user: AppHeaderUser
  onOpenProfile: () => void
}

// The compact signed-in header: brand logo, app name, and the user's
// avatar, which opens their profile. The greeting lives on the profile
// page instead, so the header stays one row tall.
export default function AppHeader({ user, onOpenProfile }: Props) {
  return (
    <header className="app-header">
      <div className="app-brand">
        <img
          className="app-logo"
          src="/lamba-logo.jpg"
          alt=""
          width="40"
          height="40"
        />
        <span className="app-name">Lamba</span>
      </div>
      <button
        type="button"
        className="app-avatar"
        aria-label="Open profile"
        onClick={onOpenProfile}
      >
        {user.photoURL ? (
          <img src={user.photoURL} alt="" width="40" height="40" />
        ) : (
          <span aria-hidden="true">
            {(user.displayName ?? user.email ?? 'L').charAt(0).toUpperCase()}
          </span>
        )}
      </button>
    </header>
  )
}

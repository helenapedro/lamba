export interface ProfileUser {
  photoURL: string | null
  displayName: string | null
  email: string | null
}

export interface ProfileCounts {
  recipes: number
  favorites: number
  shoppingItems: number
  inventoryItems: number
}

interface Props {
  user: ProfileUser
  counts: ProfileCounts
  onSignOut: () => void
}

// The signed-in user's own page: who they are, how much they have
// saved, and the way out. Nothing here shows or edits anyone else's data.
export default function Profile({ user, counts, onSignOut }: Props) {
  const initial = (user.displayName ?? user.email ?? 'L').charAt(0).toUpperCase()

  return (
    <section className="card profile">
      <h2>Profile</h2>
      <div className="profile-identity">
        {user.photoURL ? (
          <img
            className="profile-photo"
            src={user.photoURL}
            alt=""
            width="96"
            height="96"
          />
        ) : (
          <span className="profile-photo profile-photo-fallback" aria-hidden="true">
            {initial}
          </span>
        )}
        <div>
          <p className="profile-name">{user.displayName ?? 'Lamba user'}</p>
          <p className="profile-email">{user.email ?? ''}</p>
        </div>
      </div>
      <div className="profile-counts">
        <div className="profile-count">
          <span className="profile-count-number">{counts.recipes}</span>
          <span className="profile-count-label">Saved recipes</span>
        </div>
        <div className="profile-count">
          <span className="profile-count-number">{counts.favorites}</span>
          <span className="profile-count-label">Favorites</span>
        </div>
        <div className="profile-count">
          <span className="profile-count-number">{counts.shoppingItems}</span>
          <span className="profile-count-label">Shopping items</span>
        </div>
        <div className="profile-count">
          <span className="profile-count-number">{counts.inventoryItems}</span>
          <span className="profile-count-label">Items at home</span>
        </div>
      </div>
      <p className="profile-note">
        Your lists and recipes stay private to your account. Only recipes
        you mark Public can be seen by other signed-in users.
      </p>
      <button type="button" onClick={onSignOut}>
        Sign out
      </button>
    </section>
  )
}

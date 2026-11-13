// Owner check for Lamba: only the app owner's account sees the Export
// data button. The owner uid lives in the config/app document (written
// by the deploy sync script), never in client code: the repo is public.

/**
 * True only when the config holds a real owner uid and it matches the
 * signed-in user's uid. A missing, empty or non-string ownerUid, or no
 * signed-in user, means "not the owner": the button stays hidden (fail
 * closed).
 */
export function isOwnerUid(
  ownerUid: unknown,
  uid: string | null | undefined,
): boolean {
  return typeof ownerUid === 'string' && ownerUid.length > 0 && uid === ownerUid
}

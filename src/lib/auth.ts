// Simplified session getter for MVP
// In production: use proper next-auth getServerSession with authOptions
export async function getSession() {
  return null as { user?: { email?: string; name?: string } } | null;
}

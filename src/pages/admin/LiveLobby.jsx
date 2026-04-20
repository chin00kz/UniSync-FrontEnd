import LiveLobby from "../student/LiveLobby";

export default function AdminLiveLobby({ user }) {
  // We can add admin-specific logic here in the future
  return <LiveLobby user={user} />;
}

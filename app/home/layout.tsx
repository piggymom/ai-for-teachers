import { RequireProfile } from "../components/require-profile";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return <RequireProfile>{children}</RequireProfile>;
}

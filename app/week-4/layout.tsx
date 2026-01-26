import { RequireProfile } from "../components/require-profile";

export default function WeekLayout({ children }: { children: React.ReactNode }) {
  return <RequireProfile>{children}</RequireProfile>;
}

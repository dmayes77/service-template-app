import HomePage from "@/components/app/HomePage";

export const metadata = {
  title: "Home",
  description: "Welcome",
};

export default function AppHomePage() {
  return (
    <div className="space-y-6">
      <HomePage />
      {/* You can add more home modules below (cards, promos, etc.) */}
    </div>
  );
}

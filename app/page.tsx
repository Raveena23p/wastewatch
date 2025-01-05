import Image from "next/image";
import Header from "./Header";
import BinLocations from "./BinLocations";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <BinLocations />
    </main>
  );
}

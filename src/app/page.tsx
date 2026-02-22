import {
  HomeMobileHeader,
  HomeSearchBar,
  HomeCategoryGrid,
  HomeQuickSearches,
  HomeHowItWorks,
  HomeValueProps,
  HomeNearbySection,
  HomeDesktopLayout,
} from "@/components/home/home-content";

export default function Home() {
  return (
    <>
      {/* ── DESKTOP (md+): full landing-page layout with sections ── */}
      <HomeDesktopLayout />

      {/* ── MOBILE (<md): app-style vertical layout ── */}
      <div className="md:hidden bg-white min-h-screen">
        <HomeMobileHeader />
        <HomeCategoryGrid />
        <HomeHowItWorks />
        <HomeValueProps />
        <HomeNearbySection />
        <HomeQuickSearches />
      </div>
    </>
  );
}

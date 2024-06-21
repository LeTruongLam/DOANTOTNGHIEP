import TheHeader from "@/components/TheHeader";
function MainLayout({ children }) {
  return (
    <>
      <TheHeader />
      {children}
    </>
  );
}

export default MainLayout;

import { ProfileForm } from "@/components/profile-form";
import { getCurrentSellerProfile } from "@/lib/data/marketplace";

export default async function ProfilePage() {
  const seller = await getCurrentSellerProfile();

  return (
    <>
      <section className="page-heading">
        <p className="eyebrow">Profile</p>
        <h1>Seller identity buyers can inspect.</h1>
        <p className="muted">Keep social proof optional. Do not overclaim verification.</p>
      </section>
      <ProfileForm seller={seller} />
    </>
  );
}

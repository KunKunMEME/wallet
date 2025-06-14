import { CreateWallet } from "@/components/create-wallet"
import { LoginForm } from "@/components/login-form"
import { HomeView } from "@/components/home-view"

export default function Home() {
  return (
    <>
      <CreateWallet />
      <LoginForm />
      <HomeView />
    </>
  )
}

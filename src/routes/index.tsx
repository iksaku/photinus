import { redirect, useNavigate } from "solid-start";

export default function Home() {
  const navigate = useNavigate()

  return (
    <main>
      <h1>Home</h1>
      <span>You are not signed in.</span>
      <button onClick={() => navigate("/oauth/authorize")}>Sign In</button>
    </main>
  );
}

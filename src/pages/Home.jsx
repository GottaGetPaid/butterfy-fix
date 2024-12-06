import React from "react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-8 bg-darkBackground text-offWhite">
      <h1 className="text-4xl font-bigshot text-center text-spotifyGreen">Welcome to Butterfy!</h1>
      <h2 className="text-2xl font-fira text-darkText">The place to find your music match</h2>
      <img
        src="music-note-sketch.png"
        alt="Butterfy Logo"
        className="h-32 w-32 object-contain"
      />
      <a
        href="/signup"
        className="sign-up-button bg-spotifyGreen text-darkBackground px-6 py-3 rounded-full text-lg font-bold hover:bg-opacity-80 transition duration-300"
      >
        Sign Up
      </a>
      <p className="text-darkText text-sm">
        Already have an account?{" "}
        <a href="/login" className="text-spotifyGreen hover:underline">
          Login
        </a>
      </p>
    </div>
  );
}
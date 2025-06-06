"use client";

import React, { useState } from "react";
import QuoteModal from "./components/QuoteModal";

export default function Home() {
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-[#f8fbfc] font-sans overflow-x-hidden">
      {/* Dotted Background Pattern */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <svg width="100%" height="100%" className="w-full h-full" style={{ opacity: 0.18 }}>
          <defs>
            <pattern id="dots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="2" fill="#b3b3b3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col md:flex-row items-center justify-center flex-1 w-full max-w-6xl mx-auto px-4 py-12 gap-12 md:gap-8">
        {/* Left Side: Intro Section */}
        <section className="flex-1 flex flex-col items-start justify-center max-w-xl w-full gap-6">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">Welcome!</h1>
          <h2 className="text-2xl md:text-3xl font-medium text-gray-800 mb-2">Plan and navigate<br className="hidden md:block" /> from idea to launch.</h2>
          <p className="text-gray-700 text-base md:text-lg mb-4">Set the direction and pace of your product journey with clear purpose.</p>
          <form className="w-full max-w-sm mt-2">
            <label htmlFor="email" className="block text-gray-700 mb-1">Reach out!</label>
            <div className="flex">
              <input
                id="email"
                type="email"
                placeholder="email here"
                className="flex-1 rounded-l border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lime-400 text-gray-800 bg-white"
              />
              <button
                type="submit"
                className="rounded-r bg-lime-400 hover:bg-lime-500 text-gray-900 font-semibold px-4 py-2 border border-l-0 border-gray-300 transition-colors"
              >
                Send
              </button>
            </div>
          </form>
        </section>

        {/* Right Side: Two Option Cards */}
        <section className="flex-1 flex flex-col md:flex-row gap-6 w-full max-w-xl">
          {/* Card 1: Project Brief */}
          <div className="flex-1 rounded-2xl bg-gradient-to-br from-lime-200 via-lime-100 to-lime-300 shadow-md p-7 flex flex-col justify-between min-w-[260px]">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-6">This quick brief will kick off the project and keep us on track.</h3>
              <button className="w-full rounded bg-gray-900 text-lime-300 font-semibold text-lg py-2 mt-2 mb-4 hover:bg-gray-800 transition-colors">Create project brief</button>
            </div>
            <p className="text-xs text-gray-700 mt-2">Disclaimer: this brief is created and managed by you. We do not edit this brief and can not make edits to this particular brief.</p>
          </div>
          {/* Card 2: Project Quote */}
          <div className="flex-1 rounded-2xl bg-gradient-to-br from-sky-200 via-cyan-200 to-cyan-400 shadow-md p-7 flex flex-col justify-between min-w-[260px]">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-6">This quick quote to give you a general idea of the project cost.</h3>
              <button
                className="w-full rounded bg-gray-900 text-cyan-200 font-semibold text-lg py-2 mt-2 mb-4 hover:bg-gray-800 transition-colors"
                onClick={() => setShowQuoteModal(true)}
              >
                Get project quote
              </button>
            </div>
            <p className="text-xs text-gray-700 mt-2">Disclaimer: this quote is created and managed by you. This quote is not fixed and can be updated based on project needs as at discussion.</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full px-4 pb-4">
        <span className="text-xs text-gray-500 absolute left-4 bottom-4">mrbortey - 2025</span>
      </footer>
      <QuoteModal open={showQuoteModal} onClose={() => setShowQuoteModal(false)} />
    </div>
  );
}

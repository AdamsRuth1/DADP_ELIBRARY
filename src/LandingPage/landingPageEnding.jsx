import React from "react";
import { Link } from "react-router-dom";

function LandingPageEnding() {
  return (
    <>
      {/* Final CTA Section */}
      <section className="bg-[#F5F6F4] py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="rounded-[32px] bg-gradient-to-r from-[#173122] via-[#1F3D2B] to-[#244633] px-8 py-14 md:px-12 md:py-16 text-center shadow-xl shadow-[#1F3D2B]/20">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#C5A64D]">
              Secure Access
            </p>

            <h2 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight text-white">
              Ready to access the DADP eLibrary?
            </h2>

            <p className="mt-5 max-w-2xl mx-auto text-base md:text-lg leading-8 text-white/80">
              Authorized personnel can proceed to the secure login portal and
              begin accessing approved digital materials, manuals, and internal
              reference documents.
            </p>

            <div className="mt-8">
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-xl bg-[#C5A64D] px-6 py-3 text-sm font-semibold text-[#163021] shadow-sm transition hover:bg-[#d2b45a] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#1F3D2B]"
              >
                Go to Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#d8dfd8] bg-white">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-600">
          <div className="text-center md:text-left">
            <p>
              <span className="font-semibold text-[#1F3D2B]">
                DADP eLibrary
              </span>{" "}
              · Internal Use Only
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5">
            <a
              href="#"
              className="hover:text-[#1F3D2B] focus:outline-none focus:ring-2 focus:ring-[#C5A64D] rounded-sm"
            >
              Access Policy
            </a>
            <a
              href="#"
              className="hover:text-[#1F3D2B] focus:outline-none focus:ring-2 focus:ring-[#C5A64D] rounded-sm"
            >
              Contact
            </a>
            <span>© 2026 DADP</span>
          </div>
        </div>
      </footer>
    </>
  );
}

export default LandingPageEnding;
import { Link } from "react-router-dom";
import Naukri from "../assets/Naukri.png";

const LandingPage = () => {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f8f7f2] font-sans text-slate-950">
      <header className="relative z-10 mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
        <Link
          className="flex items-center gap-2.5 text-lg font-bold tracking-tight"
          to="/"
          aria-label="TalentHub home"
        >
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#2878c7] text-sm text-white">
            T
          </span>
          TalentHub
        </Link>
        <nav
          className="flex items-center gap-3 sm:gap-6"
          aria-label="Main navigation"
        >
          <Link
            className="hidden text-sm font-semibold text-slate-700 transition hover:text-[#2878c7] sm:inline"
            to="/register"
          >
            Browse jobs
          </Link>
          <Link
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold transition hover:border-[#2878c7] hover:text-[#2878c7]"
            data-testid ="signIn-btn"
            to="/login"
          >
            Sign in
          </Link>
          <Link
            className="rounded-md bg-[#2878c7] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1f65a8]"
            data-testid="create-account-btn"
            to="/register"
          >
            Create account
          </Link>
        </nav>
      </header>

      <section className="relative mx-auto grid min-h-[620px] max-w-7xl items-center gap-5 px-5 pb-12 pt-10 sm:px-8 md:grid-cols-[1.02fr_0.98fr] md:py-16 lg:px-12">
        <div className="relative z-10 max-w-2xl pb-4 md:pb-14">
          <p className="mb-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#2878c7]">
            <span className="h-2 w-2 rounded-full bg-[#e3a536]" /> A better way
            to find your next role
          </p>
          <h1 className="max-w-[650px] font-serif text-[clamp(3.25rem,7vw,6.5rem)] leading-[0.97] tracking-[-0.045em] text-[#263746]">
            Work that fits the life you want.
          </h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            Find thoughtful teams, meaningful work, and opportunities built
            around what you do best.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              className="inline-flex min-h-12 items-center gap-3 rounded-md bg-[#2878c7] px-5 text-sm font-semibold text-white transition hover:bg-[#1f65a8]"
              to="/login"
            >
              Explore all jobs <span aria-hidden="true">↗</span>
            </Link>
            <Link
              className="inline-flex min-h-12 items-center rounded-md px-4 text-sm font-semibold text-[#263746] transition hover:bg-white/70"
              to="/register"
              data-testid = "hiring-btn"
            >
              I’m hiring
            </Link>
          </div>
          <div className="mt-11 flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-[#d9ded5] pt-5 text-xs font-medium text-slate-600 sm:text-sm">
            <span>
              <strong className="mr-1.5 text-[#263746]">Real roles</strong>from
              growing teams
            </span>
            <span>
              <strong className="mr-1.5 text-[#263746]">One place</strong>for
              your next step
            </span>
          </div>
        </div>

        <div className="relative flex min-h-[300px] items-center justify-center md:min-h-[470px]">
          <div className="absolute right-[7%] top-[8%] h-[78%] w-[83%] rounded-[48%_48%_8px_8px] bg-[#e3edf6]" />
          <div className="absolute right-0 top-1/2 h-24 w-24 -translate-y-1/2 rounded-full border-[18px] border-[#e3a536]/80 sm:right-[2%] sm:h-32 sm:w-32" />
          <img
            className="relative z-[1] max-h-[380px] w-full max-w-[500px] object-contain mix-blend-multiply md:max-h-[500px]"
            src={Naukri}
            alt="Professionals collaborating around a laptop"
          />
          <div className="absolute bottom-[8%] left-0 z-[2] max-w-[225px] rounded-md border border-[#d9ded5] bg-white p-4 shadow-[0_12px_35px_rgba(23,61,51,0.10)] sm:left-[3%]">
            <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#2878c7]">
              Your next chapter
            </p>
            <p className="mt-1.5 font-serif text-lg leading-tight text-[#263746]">
              Starts with the right opportunity.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-[#e1e3dc] bg-white/70">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-8 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#2878c7]">
              Make your next move
            </p>
            <h2 className="mt-1 font-serif text-2xl text-[#263746]">
              Good work starts with a good fit.
            </h2>
          </div>
          <Link
            className="inline-flex w-fit items-center gap-2 py-2 text-sm font-bold text-[#2878c7] hover:text-[#1f65a8]"
            to="/login"
          >
            See open positions <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </main>
  );
};

export default LandingPage;

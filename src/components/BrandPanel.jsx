import Naukri from "../assets/Naukri.png";

const BrandPanel = () => {
  return (
    <aside className="relative flex min-h-[420px] flex-col overflow-hidden bg-[#f5f7ff] px-7 py-8 sm:px-12 lg:min-h-full lg:px-10 lg:py-9">
      <div className="flex items-center gap-2 text-lg font-bold tracking-tight text-slate-900">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-600 text-sm text-white shadow-sm">
          T
        </span>
        TalentHub
      </div>

      <div className="relative z-10 mt-12 max-w-sm lg:mt-16">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
          Your next opportunity
        </p>
        <h1 className="text-3xl font-bold leading-tight text-slate-950 sm:text-4xl">
          Create your account
        </h1>
        <p className="mt-4 max-w-xs text-sm leading-6 text-slate-500">
          Join TalentHub and take the next step in your career or hiring
          journey.
        </p>
      </div>

      <div className="relative mt-auto hidden pt-5 lg:block">
        <img
          className="relative mx-auto h-auto w-full max-w-[390px] object-contain mix-blend-multiply"
          src={Naukri}
          alt="Professionals collaborating at a desk"
        />
      </div>
    </aside>
  );
};

export default BrandPanel;

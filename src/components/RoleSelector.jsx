const RoleSelector = ({ role, onRoleChange }) => {
  return (
    <fieldset className="grid grid-cols-2 overflow-hidden rounded-lg border border-slate-200 bg-white">
      <legend className="sr-only">Choose your role</legend>
      {['applicant', 'recruiter'].map((option) => {
        const isActive = role === option
        return (
          <label key={option} className={`relative flex cursor-pointer items-center justify-center gap-2 px-3 py-3 text-sm font-semibold transition-colors ${isActive ? 'text-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}>
            <input className="sr-only" type="radio" name="role" value={option} checked={isActive} onChange={() => onRoleChange(option)} />
            <span aria-hidden="true" className="text-base">{option === 'applicant' ? '♙' : '▥'}</span>
            {option === 'applicant' ? 'Applicant' : 'Recruiter'}
            {isActive && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600" />}
          </label>
        )
      })}
    </fieldset>
  )
}

export default RoleSelector;
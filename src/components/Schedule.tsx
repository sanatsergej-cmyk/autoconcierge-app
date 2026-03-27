import { useState } from 'react';
import { MOCK_JOBS } from '../data/mockData';
import type { Job } from '../types';
import { JobCard } from './JobCard';

const HOURS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00'];

function JobBlock({ job, onClick }: { job: Job; onClick: () => void }) {
  const isDelayed = job.isDelayed;
  const borderColor = isDelayed ? 'border-l-alert' : 'border-l-primary';
  const shadowClass = isDelayed ? 'offset-shadow-alert' : 'offset-shadow';
  const timeColor = isDelayed ? 'text-alert' : 'text-primary';
  const statusBg = isDelayed ? 'text-alert border-alert' : 'text-steel border-steel';

  return (
    <button
      onClick={onClick}
      className={`w-full bg-asphalt border-l-4 ${borderColor} p-3 ${shadowClass} active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all text-left mb-3`}
    >
      <div className="flex justify-between items-start mb-2">
        <span className={`font-mono text-xs ${timeColor} font-bold`}>{job.timeStart} - {job.timeEnd}</span>
        <span className={`text-xs bg-gunmetal px-2 py-1 font-bold ${statusBg} border`}>
          {isDelayed ? 'ЗАДЕРЖКА' : job.status === 'in_progress' ? 'В РАБОТЕ' : job.status === 'waiting' ? 'ОЖИДАНИЕ' : job.status === 'diagnostics' ? 'ДИАГНОСТИКА' : job.status === 'ready' ? 'ГОТОВ' : 'ОПЛАЧЕН'}
        </span>
      </div>
      <h3 className="text-lg font-bold uppercase leading-tight mb-1 truncate text-bleached">{job.service}</h3>
      <p className="text-steel font-mono text-sm mb-1 truncate">{job.vehicle} / {job.vehicleYear}</p>
      <p className="text-sm font-medium uppercase text-bleached">{job.client}</p>
      {isDelayed && job.delayReason && (
        <div className="mt-2 flex items-center gap-1 text-alert text-xs font-mono">
          <span className="material-symbols-outlined text-[16px]">warning</span> {job.delayReason}
        </div>
      )}
    </button>
  );
}

export function Schedule() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  if (selectedJob) {
    return <JobCard job={selectedJob} onBack={() => setSelectedJob(null)} />;
  }

  const bays = [...new Set(MOCK_JOBS.map((j) => j.bay))];

  return (
    <div className="flex flex-col pb-24 animate-fade-in">
      {/* Date Header */}
      <header className="sticky top-0 z-40 bg-vantablack border-b-4 border-primary h-16 flex items-center justify-between px-4">
        <div className="w-10" />
        <h1 className="text-xl font-bold uppercase tracking-wide text-bleached">СЕГОДНЯ, 25 МАР</h1>
        <button className="w-10 h-10 flex items-center justify-center border-2 border-gunmetal hover:border-steel transition-colors">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>calendar_month</span>
        </button>
      </header>

      {/* Bays */}
      {bays.map((bay) => {
        const bayJobs = MOCK_JOBS.filter((j) => j.bay === bay);
        return (
          <div key={bay} className="flex flex-col mb-6">
            <div className="sticky top-16 z-30 bg-asphalt h-12 flex items-center px-4 border-y-2 border-vantablack">
              <h2 className="text-base font-bold uppercase tracking-wider text-steel">{bay}</h2>
            </div>
            <div className="flex relative mt-2">
              {/* Time column */}
              <div className="w-16 flex-shrink-0 flex flex-col border-r-2 border-asphalt bg-vantablack z-10 pt-2">
                {HOURS.map((h) => (
                  <div key={h} className="h-20 flex justify-center pt-1">
                    <span className="font-mono text-steel text-xs">{h}</span>
                  </div>
                ))}
              </div>
              {/* Jobs */}
              <div className="flex-1 p-3 space-y-0">
                {bayJobs.length > 0 ? (
                  bayJobs.map((job) => (
                    <JobBlock key={job.id} job={job} onClick={() => setSelectedJob(job)} />
                  ))
                ) : (
                  <div className="flex items-center justify-center h-48 opacity-30">
                    <div className="text-center">
                      <span className="material-symbols-outlined text-5xl text-gunmetal mb-2">garage</span>
                      <h3 className="text-xl font-bold uppercase text-gunmetal tracking-widest">БОКС СВОБОДЕН</h3>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* FAB */}
      <button className="fixed bottom-24 right-4 w-16 h-16 bg-primary text-vantablack flex items-center justify-center offset-shadow-white hover:brightness-110 active:translate-y-1 active:translate-x-1 active:shadow-none transition-all z-50 border-2 border-vantablack">
        <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'wght' 700" }}>add</span>
      </button>
    </div>
  );
}

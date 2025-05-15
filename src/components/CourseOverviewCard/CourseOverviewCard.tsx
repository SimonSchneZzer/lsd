'use client';

type Props = {
  courseId: string;
  summary: string;
  ects: number;
  lessonUnits: number;
  homeHours: number;
};

export default function CourseOverviewCard({
  courseId,
  summary,
  ects,
  lessonUnits,
  homeHours,
}: Props) {
  const contactHours = (lessonUnits * 45) / 60;
  const isNegative = homeHours < 0;

  return (
    <div className="p-6 mb-6 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-black/30 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 text-center">
        {/* Titel oben */}
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {summary.replace(/^.*? - /, '')}
        </h2>

        {/* Mitte: ECTS & Course ID */}
        <div className="flex justify-between w-full px-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="text-left">
            <span className="block">ECTS</span>
            <span className="text-base font-medium text-gray-900 dark:text-white">{ects}</span>
          </div>
          <div className="text-right">
            <span className="block">Course ID</span>
            <span className="text-base font-medium text-gray-900 dark:text-white">{courseId}</span>
          </div>
        </div>

        {/* Unten: Kontakt & Selbststudium */}
        <div className="flex justify-between w-full px-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="text-left">
            <span className="block">Kontakt</span>
            <span className="text-base font-medium text-gray-900 dark:text-white">
              {contactHours.toFixed(1)}h
            </span>
          </div>
          <div className="text-right">
            <span className="block">Selbststudium</span>
            <span
              className={`text-base font-medium ${
                isNegative ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'
              }`}
            >
              {homeHours.toFixed(1)}h
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
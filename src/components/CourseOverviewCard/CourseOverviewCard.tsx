'use client';

type Props = {
  courseId: string;
  summary: string;
  ects: number;
  lessonUnits: number;
  homeHours: number;
};

export default function CourseOverviewCard({
  summary,
  ects,
  lessonUnits,
  homeHours,
}: Props) {
  const contactHours = (lessonUnits * 45 / 60).toFixed(1);
  const isNegative = homeHours < 0;

  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-x-8 gap-y-2 p-6 mb-6 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-black/30 backdrop-blur-sm">
      {/* Links oben: Kursname */}
      <div>
        <span className="block text-lg font-semibold text-gray-900 dark:text-white">
          {summary.replace(/^.*? - /, '')}
        </span>
      </div>

      {/* Rechts oben: Kontaktstunden */}
      <div className="text-right sm:text-left">
        <span className="block text-sm text-gray-500 dark:text-gray-400">Kontakt</span>
        <span className="text-base font-medium text-gray-900 dark:text-white">
          {contactHours}h
        </span>
      </div>

      {/* Links unten: ECTS */}
      <div>
        <span className="block text-sm text-gray-500 dark:text-gray-400">ECTS</span>
        <span className="text-base font-medium text-gray-900 dark:text-white">
          {ects}
        </span>
      </div>

      {/* Rechts unten: Selbststudium */}
      <div className="text-right sm:text-left">
        <span className="block text-sm text-gray-500 dark:text-gray-400">Selbststudium</span>
        <span
          className={`text-base font-medium ${
            isNegative ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'
          }`}
        >
          {homeHours.toFixed(1)}h
        </span>
      </div>
    </div>
  );
}
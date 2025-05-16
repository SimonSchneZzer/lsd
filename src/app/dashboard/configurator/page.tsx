'use client';

import React from 'react';
import Spinner from '@/components/Spinner/Spinner';
import CourseSettingCard from '@/components/CourseSettingCard/CourseSettingCard';
import { useConfigurator } from '@/hooks/useConfigurator';
import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary';
import NotLoggedIn from '@/components/NotLoggedIn/NotLoggedIn';

export default function ConfiguratorPage() {
  const {
    userId,
    loading,
    rawCourses,
    icsUrl,
    setIcsUrl, 
    handleChange,
    handleAdd,
    handleDelete,
    handleSaveAll,
    handleFetchICS,
  } = useConfigurator();

  if (!loading && userId === null) {
    return <NotLoggedIn context="the configurator" />;
  }

  return (
    <div>
      {loading && <Spinner />}

      {!loading && rawCourses.length === 0 && (
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
          <label htmlFor="icsUrl" className="font-medium text-gray-700 dark:text-gray-300">
            ICS URL:
          </label>
          <input
            id="icsUrl"
            type="text"
            value={icsUrl}
            onChange={e => setIcsUrl(e.target.value)}
            placeholder="Enter your ICS URL"
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleFetchICS}
            disabled={loading}
            className="px-4 py-2 border-2 border-[var(--glass-color)] bg-[var(--glass-bg)] text-[var(--glass-color)] rounded-[var(--glass-radius)] cursor-pointer transition-colors duration-300 ease-in-out hover:bg-[var(--glass-color)] hover:text-[var(--glass-bg)] hover:border-[var(--glass-bg)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Fetch Courses
          </button>
        </div>
      )}

      {rawCourses.length > 0 && (
        <>
            <div className="space-y-6 max-w-[1200px] mx-auto ">
            {rawCourses.map((course, i) => (
              <ErrorBoundary key={i}>
                <CourseSettingCard
                  course={course}
                  index={i}
                  onChange={handleChange}
                  onDelete={handleDelete}
                  disabled={loading}
                />
              </ErrorBoundary>
            ))}
          </div>

          <div className="flex justify-between mt-6">
            <button
              onClick={handleAdd}
              className="px-4 py-2 border-2 border-[var(--glass-color)] bg-[var(--glass-bg)] text-[var(--glass-color)] rounded-[var(--glass-radius)] cursor-pointer transition-colors duration-300 ease-in-out hover:bg-[var(--glass-color)] hover:text-white hover:border-[var(--glass-bg)] hover:dark:text-black"
            >
              ➕ Add Course
            </button>
            <button
              onClick={handleSaveAll}
              className="px-4 py-2 border-2 border-[var(--glass-color)] bg-[var(--glass-bg)] text-[var(--glass-color)] rounded-[var(--glass-radius)] cursor-pointer transition-colors duration-300 ease-in-out hover:bg-[var(--glass-color)] hover:text-white hover:border-[var(--glass-bg)] hover:dark:text-black"
            >
              💾 Save Changes
            </button>
          </div>
        </>
      )}
    </div>
  );
}
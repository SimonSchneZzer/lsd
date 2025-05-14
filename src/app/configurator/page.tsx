"use client";

import React from "react";
import Spinner from "@/components/Spinner/Spinner";
import CourseCard from "@/components/CourseCard/CourseCard";
import styles from "./ConfiguratorLayout.module.css";
import { useConfigurator } from "@/hooks/useConfigurator";
import ErrorBoundary from "@/components/ErrorBoundary/ErrorBoundary";
import NotLoggedIn from '@/components/NotLoggedIn/NotLoggedIn';


export default function ConfiguratorPage() {
  const {
    userId,
    loading,
    error,
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
    <div className={styles.wrapper}>
      {loading && <Spinner />}
      {error && <p className="error">{error}</p>}

      {!loading && rawCourses.length === 0 && (
        <div className={styles["form-row"]}>
          <label htmlFor="icsUrl">ICS URL:</label>
          <input
            id="icsUrl"
            type="text"
            value={icsUrl}
            onChange={(e) => setIcsUrl(e.target.value)}
            placeholder="Enter your ICS URL"
          />
          <button onClick={handleFetchICS} disabled={loading}>
            Fetch Courses
          </button>
        </div>
      )}

      {rawCourses.length > 0 && (
        <>
          <div className={styles["courses-container"]}>
            {rawCourses.map((course, i) => (
              <ErrorBoundary key={i}>
                <CourseCard
                  course={course}
                  index={i}
                  onChange={handleChange}
                  onDelete={handleDelete}
                  disabled={loading}
                />
              </ErrorBoundary>
            ))}
          </div>

          <div className={styles["actions-row"]}>
            <button onClick={handleAdd}>➕ Add Course</button>
            <button onClick={handleSaveAll}>💾 Save Changes</button>
          </div>
        </>
      )}
    </div>
  );
}

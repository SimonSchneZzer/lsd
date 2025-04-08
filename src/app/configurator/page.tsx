'use client';

import { useState } from 'react';
import { CalendarEvent } from '@/types/event';
import Spinner from '@/components/Spinner';


type EditableCourse = {
  courseId: string;
  summary: string;
  lessonUnits: number;
  ects: number;
};

export default function ConfiguratorPage() {
  const [icsUrl, setIcsUrl] = useState('');
  const [courses, setCourses] = useState<EditableCourse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFetch = async () => {
    setLoading(true);
    setError('');
    try {
      // For now, the API does not change with the ICS URL.
      const response = await fetch('/api/calendar');
      if (!response.ok) {
        throw new Error('Error fetching calendar data');
      }
      const data = await response.json();
      const events: CalendarEvent[] = data.events || [];

      const grouped = events.reduce((acc, event) => {
        // Attempt to split summary into two parts if it contains a ' - ' separator.
        let parsedCourseId = event.courseId || event.summary;
        let parsedSummary = event.summary;
        if (event.summary.includes(' - ')) {
          const parts = event.summary.split(' - ');
          // Use the first segment as courseId, rest as summary.
          parsedCourseId = parts[0].trim();
          parsedSummary = parts.slice(1).join(' - ').trim();
        }
        // Use event.courseId as grouping key if available.
        const id = event.courseId || parsedCourseId;

        if (!acc[id]) {
          acc[id] = {
            courseId: parsedCourseId,
            summary: parsedSummary,
            lessonUnits: 0,
            ects: event.ects || 0,
          };
        }

        acc[id].lessonUnits += event.lessonUnits;
        return acc;
      }, {} as Record<string, EditableCourse>);

      // Sort courses so that courses with identical summary and courseId are at the top.
      const sortedCourses = Object.values(grouped).sort((a, b) => {
        const aFaulty = a.summary === a.courseId;
        const bFaulty = b.summary === b.courseId;
        if (aFaulty && !bFaulty) return -1;
        if (!aFaulty && bFaulty) return 1;
        return 0;
      });

      setCourses(sortedCourses);
    } catch (err) {
      console.error(err);
      setError('Error fetching courses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    index: number,
    field: keyof EditableCourse,
    value: string
  ) => {
    setCourses((prev) => {
      const newCourses = [...prev];
      if (field === 'lessonUnits' || field === 'ects') {
        // Convert to number.
        const parsed = Number(value);
        if (isNaN(parsed)) return prev;
        newCourses[index] = { ...newCourses[index], [field]: parsed };
      } else {
        newCourses[index] = { ...newCourses[index], [field]: value };
      }
      return newCourses;
    });
  };

  const handleDelete = (index: number) => {
    setCourses((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAdd = () => {
    setCourses((prev) => [
      ...prev,
      {
        courseId: '',
        summary: '',
        lessonUnits: 0,
        ects: 0,
      },
    ]);
  };

  return (
    <div className="configurator-container">
      <h1>Calendar Configurator</h1>
      <div className="url-input-container">
        <label htmlFor="icsUrl">ICS URL:</label>
        <input
          type="text"
          id="icsUrl"
          value={icsUrl}
          onChange={(e) => setIcsUrl(e.target.value)}
          placeholder="Enter your ICS URL here..."
        />
        <button onClick={handleFetch}>Fetch Courses</button>
      </div>

      {loading && <Spinner />}
      {error && <p className="error">{error}</p>}

      {courses.length > 0 && (
        <div className="courses-container">
          {courses.map((course, index) => (
            <div key={index} className="course-card">
              <div className="course-field">
                <label>Summary:</label>
                <input
                  type="text"
                  value={course.summary}
                  onChange={(e) =>
                    handleChange(index, 'summary', e.target.value)
                  }
                />
              </div>
              <div className="course-field">
                <label>Course ID:</label>
                <input
                  type="text"
                  value={course.courseId}
                  onChange={(e) =>
                    handleChange(index, 'courseId', e.target.value)
                  }
                />
              </div>
              <div className="course-field">
                <label>Lesson Units:</label>
                <input
                  type="number"
                  value={course.lessonUnits}
                  onChange={(e) =>
                    handleChange(index, 'lessonUnits', e.target.value)
                  }
                />
              </div>
              <div className="course-field">
                <label>ECTS:</label>
                <input
                  type="number"
                  value={course.ects}
                  onChange={(e) =>
                    handleChange(index, 'ects', e.target.value)
                  }
                />
              </div>
              <button
                className="delete-button"
                onClick={() => handleDelete(index)}
              >
                Delete Course
              </button>
            </div>
          ))}
        </div>
      )}

      {courses.length > 0 && (
        <div className="add-course-container">
          <button onClick={handleAdd}>Add Course</button>
        </div>
      )}
    </div>
  );
}
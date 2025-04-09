'use client';

import { useState, useEffect } from 'react';
import Spinner from '@/components/Spinner/Spinner';

type EditableCourse = {
  id?: string; // Wird von der Datenbank (Prisma) gesetzt
  courseId: string;
  summary: string;
  lessonUnits: number;
  ects: number;
};

export default function ConfiguratorPage() {
  // Der ICS URL Input bleibt bestehen – falls du ihn noch für andere Zwecke nutzen möchtest
  const [icsUrl, setIcsUrl] = useState('');
  const [courses, setCourses] = useState<EditableCourse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFetch = async () => {
    setLoading(true);
    setError('');
    try {
      // Zuerst prüfe, ob persistente Daten vorhanden sind:
      const persistentRes = await fetch('/api/courses');
      if (!persistentRes.ok) throw new Error('Error fetching persistent courses');
      const persistentData = await persistentRes.json();
  
      if (persistentData.courses && persistentData.courses.length > 0) {
        // Falls bereits Kurse in der DB gespeichert sind, benutze diese
        setCourses(persistentData.courses);
      } else {
        // Falls noch keine persistente Daten existieren, hole die ICS-Daten:
        const response = await fetch(`/api/calendar?icsUrl=${encodeURIComponent(icsUrl)}`);
        if (!response.ok) throw new Error('Error fetching courses from ICS feed');
        const icsData = await response.json();
        
        // Verwende icsData.events als Grundlage:
        const fetchedCourses = icsData.events;
  
        // Speichere jeden Kurs in der Datenbank (z.B. per POST an /api/courses)
        for (const course of fetchedCourses) {
          const postRes = await fetch('/api/courses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(course),
          });
          if (!postRes.ok) {
            console.error('Error saving course:', course);
          }
        }
        
        // Lese nach dem Speichern erneut die persistierten Kurse
        const persistentRes2 = await fetch('/api/courses');
        if (!persistentRes2.ok) throw new Error('Error fetching persistent courses');
        const persistentData2 = await persistentRes2.json();
        setCourses(persistentData2.courses);
      }
    } catch (err) {
      console.error(err);
      setError('Error fetching courses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Aktualisiert den lokalen State beim Ändern eines Feldes
  const handleChange = (index: number, field: keyof EditableCourse, value: string) => {
    setCourses((prev) => {
      const newCourses = [...prev];
      if (field === 'lessonUnits' || field === 'ects') {
        const parsed = Number(value);
        if (isNaN(parsed)) return prev;
        newCourses[index] = { ...newCourses[index], [field]: parsed };
      } else {
        newCourses[index] = { ...newCourses[index], [field]: value };
      }
      return newCourses;
    });
  };

  // Fügt einen neuen Kurs in der Datenbank hinzu (Create)
  const handleAdd = async () => {
    try {
      const newCourseData = {
        courseId: '',
        summary: '',
        lessonUnits: 0,
        ects: 0,
      };
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCourseData),
      });
      if (!res.ok) {
        throw new Error('Error creating course');
      }
      const data = await res.json();
      setCourses((prev) => [...prev, data.course]);
    } catch (err) {
      console.error(err);
      setError('Error adding course');
    }
  };

  // Löscht einen Kurs aus der Datenbank (Delete)
  const handleDelete = async (index: number) => {
    const courseToDelete = courses[index];
    try {
      if (courseToDelete && courseToDelete.id) {
        const res = await fetch(`/api/courses/${courseToDelete.id}`, {
          method: 'DELETE',
        });
        if (!res.ok) {
          throw new Error('Error deleting course');
        }
      }
      setCourses((prev) => prev.filter((_, i) => i !== index));
    } catch (err) {
      console.error(err);
      setError('Error deleting course');
    }
  };

  // Speichert alle Änderungen an existierenden Kursen (Update)
  const handleSaveAll = async () => {
    try {
      for (const course of courses) {
        if (course.id) {
          const res = await fetch(`/api/courses/${course.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(course),
          });
          if (!res.ok) {
            throw new Error(`Error updating course with id ${course.id}`);
          }
        }
      }
      alert("Courses saved to database");
    } catch (err) {
      console.error(err);
      setError('Error saving courses');
    }
  };

  // Optional: Lade die persistierten Kurse automatisch beim Mounten
  useEffect(() => {
    handleFetch();
  }, []);

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
        {/* Diese Schaltfläche kann entweder den ICS-Import triggern oder die persistierten Kurse laden */}
        <button onClick={handleFetch}>Fetch Courses</button>
      </div>

      {loading && <Spinner />}
      {error && <p className="error">{error}</p>}

      {courses.length > 0 && (
        <>
          <div className="courses-container">
            {courses.map((course, index) => (
              <div key={index} className="course-card">
                <div className="course-field">
                  <label>Summary:</label>
                  <input
                    type="text"
                    value={course.summary || ''}
                    onChange={(e) => handleChange(index, 'summary', e.target.value)}
                  />
                </div>
                <div className="course-field">
                  <label>Course ID:</label>
                  <input
                    type="text"
                    value={course.courseId || ''}
                    onChange={(e) => handleChange(index, 'courseId', e.target.value)}
                  />
                </div>
                <div className="course-field">
                  <label>Lesson Units:</label>
                  <input
                    type="number"
                    value={course.lessonUnits || ''}
                    onChange={(e) => handleChange(index, 'lessonUnits', e.target.value)}
                  />
                </div>
                <div className="course-field">
                  <label>ECTS:</label>
                  <input
                    type="number"
                    value={course.ects || ''}
                    onChange={(e) => handleChange(index, 'ects', e.target.value)}
                  />
                </div>
                <button className="delete-button" onClick={() => handleDelete(index)}>
                  Delete Course
                </button>
              </div>
            ))}
          </div>
          <div className="save-changes-container">
            <button onClick={handleSaveAll}>Save Changes</button>
          </div>
        </>
      )}

      {courses.length > 0 && (
        <div className="add-course-container">
          <button onClick={handleAdd}>Add Course</button>
        </div>
      )}
    </div>
  );
}
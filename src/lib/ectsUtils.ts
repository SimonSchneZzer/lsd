export function flattenMapping(mappingData: any): Record<string, number> {
    const flattened: Record<string, number> = {};
  
    for (const semester in mappingData) {
      const semesterData = mappingData[semester];
      if (Array.isArray(semesterData)) {
        semesterData.forEach((course: { name: string; ects: number }) => {
          flattened[course.name] = course.ects;
        });
      } else if (typeof semesterData === "object") {
        if (semesterData.common) {
          semesterData.common.forEach((course: { name: string; ects: number }) => {
            flattened[course.name] = course.ects;
          });
        }
  
        if (semesterData.wahlpflicht) {
          semesterData.wahlpflicht.forEach((course: { name: string; ects: number }) => {
            flattened[course.name] = course.ects;
          });
        }
  
        if (semesterData.schwerpunkt) {
          const sp = semesterData.schwerpunkt;
          if (sp.web) {
            sp.web.forEach((course: { name: string; ects?: number }) => {
              flattened[course.name] = course.ects || 0;
            });
          }
          if (sp.game) {
            sp.game.forEach((course: { name: string; ects?: number }) => {
              flattened[course.name] = course.ects || 0;
            });
          }
        }
      }
    }
  
    return flattened;
  }
  
  export function getEctsValue(summary: string, mapping: Record<string, number>): number {
    const normalizedSummary = summary.toLowerCase().replace(/\s+/g, '');
    const match = Object.keys(mapping).find((key) =>
      normalizedSummary.includes(key.toLowerCase().replace(/\s+/g, ''))
    );
    return match ? mapping[match] : 0;
  }
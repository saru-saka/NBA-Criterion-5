/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface FacultyEntry {
  sn: number;
  name: string;
  pan: string;
  degree: string;
  university: string;
  specialization: string;
  joiningDate: string;
  experience: number;
  joiningDesignation: string;
  presentDesignation: string;
  nature: string;
  currentlyAssociated: boolean;
  leavingDate?: string;
}

export interface YearData {
  year: string;
  students: number;
  facultyCount: number;
  phdCount: number;
  mastersCount: number;
  professors: number;
  associateProfessors: number;
  assistantProfessors: number;
  retentionScore: string;
}

export const NBA_DATA: YearData[] = [
  {
    year: "2025-26 (CAY)",
    students: 2357,
    facultyCount: 120,
    phdCount: 9,
    mastersCount: 34,
    professors: 5,
    associateProfessors: 5,
    assistantProfessors: 33,
    retentionScore: "9.36"
  },
  {
    year: "2024-25 (CAYm1)",
    students: 2345,
    facultyCount: 124,
    phdCount: 8,
    mastersCount: 26,
    professors: 5,
    associateProfessors: 3,
    assistantProfessors: 26,
    retentionScore: "9.87"
  },
  {
    year: "2023-24 (CAYm2)",
    students: 2307,
    facultyCount: 125,
    phdCount: 6,
    mastersCount: 26,
    professors: 4,
    associateProfessors: 2,
    assistantProfessors: 26,
    retentionScore: "9.39"
  }
];

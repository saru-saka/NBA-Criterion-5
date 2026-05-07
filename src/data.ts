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
  facultyDetails: FacultyEntry[];
}

export const NBA_DATA: YearData[] = [
  {
    year: "2025-26 (CAY)",
    students: 703,
    facultyCount: 43,
    phdCount: 9,
    mastersCount: 34,
    professors: 5,
    associateProfessors: 5,
    assistantProfessors: 33,
    facultyDetails: [
      { sn: 1, name: "Dr Smitha Kurian", pan: "BLEPS9261H", degree: "Ph.D", university: "VTU", specialization: "CSE", joiningDate: "24.08.2005", experience: 20.5, joiningDesignation: "Asst Prof", presentDesignation: "Assoc. Prof", nature: "Regular", currentlyAssociated: true },
      { sn: 2, name: "Dr.Pushpa M", pan: "ANVPM0081H", degree: "Ph.D", university: "REVA", specialization: "CSE", joiningDate: "28.08.2023", experience: 2.5, joiningDesignation: "Prof", presentDesignation: "Prof", nature: "Regular", currentlyAssociated: true },
      { sn: 3, name: "Dr Sharada. K.A", pan: "ALZPA7335E", degree: "Ph.D", university: "SJTJT", specialization: "CSE", joiningDate: "15.10.2020", experience: 5.3, joiningDesignation: "Assoc. Prof", presentDesignation: "Prof", nature: "Regular", currentlyAssociated: true },
      // ... simplified list for display
    ]
  },
  {
    year: "2024-25 (CAYm1)",
    students: 583,
    facultyCount: 34,
    phdCount: 8,
    mastersCount: 26,
    professors: 5,
    associateProfessors: 3,
    assistantProfessors: 26,
    facultyDetails: [
       { sn: 1, name: "Dr Smitha Kurian", pan: "BLEPS9261H", degree: "Ph.D", university: "VTU", specialization: "CSE", joiningDate: "24.08.2005", experience: 20.5, joiningDesignation: "Asst Prof", presentDesignation: "Assoc. Prof", nature: "Regular", currentlyAssociated: true },
       // ... simplified list
    ]
  },
  {
    year: "2023-24 (CAYm2)",
    students: 570,
    facultyCount: 32,
    phdCount: 6,
    mastersCount: 26,
    professors: 4,
    associateProfessors: 2,
    assistantProfessors: 26,
    facultyDetails: [
       { sn: 1, name: "Dr Smitha Kurian", pan: "BLEPS9261H", degree: "Ph.D", university: "VTU", specialization: "CSE", joiningDate: "24.08.2005", experience: 20.5, joiningDesignation: "Asst Prof", presentDesignation: "Assoc. Prof", nature: "Regular", currentlyAssociated: true },
       // ... simplified list
    ]
  }
];

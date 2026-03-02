export type Role = 'SuperAdmin' | 'AdminEmpresa' | 'Instructor' | 'Estudiante';

export interface User {
    id: string;
    email: string;
    nombre: string;
    apellido: string;
    avatarUrl?: string;
    role: Role[];
    empresaId: string;
    ultimoAcceso: string;
}

export interface Company {
    id: string;
    nombre: string;
    logoUrl?: string;
    activa: boolean;
}

export type ActivityType = 'SCORM' | 'Video' | 'Quiz' | 'Tarea' | 'Archivo';

export interface CourseActivity {
    id: string;
    sectionId: string;
    tipo: ActivityType;
    titulo: string;
    contenidoUrl: string;
    ponderacion: number; // Porcentaje de impacto en la nota final
}

export interface CourseSection {
    id: string;
    courseId: string;
    titulo: string;
    orden: number;
    actividades: CourseActivity[];
}

export interface Course {
    id: string;
    companyId: string;
    titulo: string;
    descripcion: string;
    portadaUrl?: string;
    nivel: string; // ej: Principiante
    estado: 'borrador' | 'publicado';
    secciones: CourseSection[];
    inscritosCount: number;
}

export interface Enrollment {
    id: string;
    userId: string;
    courseId: string;
    fechaInscripcion: string;
    estado: 'en_progreso' | 'completado';
    progresoPorcentaje: number;
}

export interface ActivityAttempt {
    id: string;
    enrollmentId: string;
    activityId: string;
    fechaIntento: string;
    calificacion: number | null;
    estado: 'completado' | 'fallido' | 'pendiente';
}

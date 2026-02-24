// Shared types extracted from backend schema
// This file contains the essential types needed by the frontend

export interface User {
    id: string;
    username: string;
    password?: string; // Optional since it should be omitted in API responses
    role: string; // admin, doctor, reception, patient
    name: string;
    email?: string;
    age?: number;
    gender?: string; // Added gender field
    bloodGroup?: string; // Added bloodGroup field
    department?: string; // for doctors
    specialization?: string; // for doctors
    phone?: string;
    address?: string;
    profileImage?: string;
    status?: 'online' | 'offline' | 'busy'; // User availability status
    createdAt?: Date;
}

export interface Patient {
    id: string;
    userId?: string;
    medicalHistory?: any; // JSON object
    allergies?: string[];
    medications?: any; // JSON object
    emergencyContact?: any; // JSON object
    bloodType?: string;
    height?: number; // in cm
    weight?: number; // in kg
    bmi?: string;
    lastVisit?: Date;
}

export interface Appointment {
    id: string;
    patientId?: string;
    doctorId?: string;
    scheduledAt: Date;
    status: string; // scheduled, in-progress, completed, cancelled
    priority: string; // normal, urgent, critical
    symptoms?: string;
    diagnosis?: string;
    treatment?: string;
    notes?: string;
    createdAt?: Date;
}

export interface Message {
    id: string;
    senderId?: string;
    receiverId?: string;
    content: string;
    messageType: string; // direct, broadcast, emergency
    isRead?: boolean;
    createdAt?: Date;
}

export interface FitnessData {
    id: string;
    patientId?: string;
    date: Date;
    steps?: number;
    waterIntake?: number; // glasses
    sleepHours?: string;
    exerciseMinutes?: number;
    heartRate?: number;
    bloodPressure?: string;
    notes?: string;
}

export interface QueueEntry {
    id: string;
    patientId?: string;
    doctorId?: string;
    position: number;
    estimatedWaitTime?: number; // in minutes
    status: string; // waiting, in-consultation, completed
    priority: string; // normal, urgent, critical
    createdAt?: Date;
    symptoms?: string;
    medicalHistory?: string;
    lastVisit?: Date;
    bloodType?: string;
    age?: number;
    gender?: string;
}

export interface Attendance {
    id: string;
    userId?: string;
    date: Date;
    checkIn?: Date;
    checkOut?: Date;
    status: string; // present, absent, late, on-break
    location?: string; // lab, icu, desk, resting, lunch
    totalHours?: string;
}

export interface AIInsight {
    id: string;
    userId?: string;
    type: string; // workflow_optimization, patient_prioritization, resource_allocation
    content: string;
    confidence?: number;
    actionable?: boolean;
    createdAt?: Date;
}

// Input types for creating new records
export interface CreateUserInput {
    username: string;
    password: string;
    role: string;
    name: string;
    email?: string;
    age?: number;
    gender?: string; // Added gender field
    bloodGroup?: string; // Added bloodGroup field
    department?: string;
    specialization?: string;
    phone?: string;
    address?: string;
    profileImage?: string;
}

export interface CreatePatientInput {
    userId?: string;
    medicalHistory?: any;
    allergies?: string[];
    medications?: any;
    emergencyContact?: any;
    bloodType?: string;
    height?: number;
    weight?: number;
    bmi?: string;
    lastVisit?: Date;
}

export interface LabResult {
    id: string;
    patientId?: string;
    doctorId?: string;
    testType: string;
    testDate: Date;
    collectionDate: Date;
    reportedDate: Date;
    status: 'normal' | 'abnormal' | 'pending';
    results: Array<{
        name: string;
        value: string;
        unit: string;
        referenceRange: string;
        status: 'normal' | 'high' | 'low';
    }>;
    patientAge?: number;
    patientGender?: string;
    bloodType?: string;
    comments?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

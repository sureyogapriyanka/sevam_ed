import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import PatientEditProfilePage from "./PatientEditProfilePage";
import EditProfilePage from "./doctor/EditProfilePage";

export default function ProfileEditRouter() {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role === 'patient') {
        return <PatientEditProfilePage />;
    }

    return <EditProfilePage />;
}

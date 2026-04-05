import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { patientService } from '../services/api';

// Custom hook for patient operations
export const usePatients = () => {
    const queryClient = useQueryClient();

    // Get all patients
    const { data: patients, isLoading: isPatientsLoading, error: patientsError } = useQuery({
        queryKey: ['patients'],
        queryFn: patientService.getAll,
    });

    // Get patient by ID
    const usePatient = (id: string) => {
        return useQuery({
            queryKey: ['patients', id],
            queryFn: () => patientService.getById(id),
        });
    };

    // Get patient by user ID
    const usePatientByUserId = (userId: string) => {
        return useQuery({
            queryKey: ['patients', 'user', userId],
            queryFn: () => patientService.getByUserId(userId),
        });
    };

    // Create patient mutation
    const createPatientMutation = useMutation({
        mutationFn: patientService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['patients'] });
        },
    });

    // Update patient mutation
    const updatePatientMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => patientService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['patients'] });
        },
    });

    // Delete patient mutation
    const deletePatientMutation = useMutation({
        mutationFn: patientService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['patients'] });
        },
    });

    return {
        patients: patients?.data,
        isPatientsLoading,
        patientsError,
        usePatient,
        usePatientByUserId,
        createPatient: createPatientMutation.mutate,
        createPatientLoading: createPatientMutation.isPending,
        createPatientError: createPatientMutation.error,
        updatePatient: updatePatientMutation.mutate,
        updatePatientLoading: updatePatientMutation.isPending,
        updatePatientError: updatePatientMutation.error,
        deletePatient: deletePatientMutation.mutate,
        deletePatientLoading: deletePatientMutation.isPending,
        deletePatientError: deletePatientMutation.error,
    };
};

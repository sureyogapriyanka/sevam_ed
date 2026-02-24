import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { appointmentService } from '../services/api';

// Custom hook for appointment operations
export const useAppointments = () => {
    const queryClient = useQueryClient();

    // Get all appointments
    const { data: appointments, isLoading: isAppointmentsLoading, error: appointmentsError } = useQuery({
        queryKey: ['appointments'],
        queryFn: appointmentService.getAll,
    });

    // Get appointment by ID
    const useAppointment = (id: string) => {
        return useQuery({
            queryKey: ['appointments', id],
            queryFn: () => appointmentService.getById(id),
        });
    };

    // Create appointment mutation
    const createAppointmentMutation = useMutation({
        mutationFn: appointmentService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['appointments'] });
        },
    });

    // Update appointment mutation
    const updateAppointmentMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => appointmentService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['appointments'] });
        },
    });

    // Delete appointment mutation
    const deleteAppointmentMutation = useMutation({
        mutationFn: appointmentService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['appointments'] });
        },
    });

    return {
        appointments: appointments?.data,
        isAppointmentsLoading,
        appointmentsError,
        useAppointment,
        createAppointment: createAppointmentMutation.mutate,
        createAppointmentLoading: createAppointmentMutation.isPending,
        createAppointmentError: createAppointmentMutation.error,
        updateAppointment: updateAppointmentMutation.mutate,
        updateAppointmentLoading: updateAppointmentMutation.isPending,
        updateAppointmentError: updateAppointmentMutation.error,
        deleteAppointment: deleteAppointmentMutation.mutate,
        deleteAppointmentLoading: deleteAppointmentMutation.isPending,
        deleteAppointmentError: deleteAppointmentMutation.error,
    };
};

'use client'

import { useEffect, useState, useCallback, ChangeEvent, FormEvent } from 'react'
import { supabase } from '@/lib/supabase' // Asegúrate que la ruta sea correcta
import { toast } from 'sonner'
import { User as SupabaseUser } from '@supabase/supabase-js' // Tipo de Supabase
import { Loader2, Edit3, Save, XCircle, UserCog, CheckCircle, ShieldQuestion, AlertTriangle } from 'lucide-react';

// Interfaz para los datos del perfil que se manejan en este componente
interface ProfileData {
  id: string; // Generalmente coincide con user.id
  email?: string; // El email usualmente viene del objeto User de Supabase Auth
  role?: string | null;
  points?: number | null;
  subscription_?: boolean | null; // Asumiendo que es un booleano
  username?: string | null; // Si también gestionas username aquí
  // Añade otros campos que obtengas de la tabla 'profiles' y uses
}

interface UserProfileEditProps {
  user: SupabaseUser; // Recibe el objeto User completo de Supabase Auth
  // onProfileUpdate?: (updatedProfile: ProfileData) => void; // Callback opcional
}

export default function UserProfileEdit({ user }: UserProfileEditProps) {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null); // Para errores de carga del perfil
  const [editing, setEditing] = useState(false);

  // Guardar una copia del perfil original para el botón "Cancelar"
  const [originalProfileData, setOriginalProfileData] = useState<ProfileData | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setLoading(false);
      setProfile(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('id, role, points, subscription_, username') // Selecciona los campos que existen en tu tabla 'profiles'
                                                            // 'email' se toma de user.email
        .eq('id', user.id)
        .single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') { // Perfil no encontrado
          console.warn('Profile not found for user:', user.id, 'Attempting to use default or create one.');
          // Podrías inicializar un perfil por defecto aquí o manejarlo como un error específico
          // Por ahora, mostramos un error y permitimos que el usuario no tenga perfil.
          setError('Perfil no encontrado. Podría necesitar ser creado.');
          setProfile(null); // O un perfil por defecto: { id: user.id, email: user.email, role: 'user', points: 0, subscription_: false }
          setOriginalProfileData(null);
        } else {
          throw fetchError; // Otros errores de Supabase
        }
      } else {
        // Combinar email del user de auth con datos del perfil de la BD
        const fullProfileData = { ...data, email: user.email, id: user.id };
        setProfile(fullProfileData);
        setOriginalProfileData(fullProfileData); // Guardar para "cancelar"
      }
    } catch (err: any) {
      console.error('Error fetching profile:', err);
      setError('❌ No se pudo cargar el perfil. Inténtalo de nuevo.');
      toast.error('Error al cargar perfil', { description: err.message });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleInputChange = (field: keyof ProfileData, value: any) => {
    setProfile(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleSubscriptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setProfile(prev => prev ? { ...prev, subscription_: e.target.checked } : null);
    // Activar modo edición automáticamente si no lo está, para cambios en el checkbox
    if (!editing && profile) { // Solo si hay un perfil cargado
      setEditing(true);
    }
  };
  
  const handleEdit = () => {
    setOriginalProfileData(profile); // Guardar estado actual antes de editar
    setEditing(true);
  };

  const handleCancel = () => {
    setProfile(originalProfileData); // Restaurar al original
    setEditing(false);
  };

  const handleSave = useCallback(async (event?: FormEvent<HTMLFormElement>) => {
    if (event) event.preventDefault();
    if (!profile || !user) return; // No debería pasar si el botón de guardar está visible

    setIsSaving(true);
    try {
      // Aquí solo actualizamos 'subscription_', pero podrías añadir otros campos del 'profile' local
      const updates: Partial<ProfileData> = {
        subscription_: profile.subscription_,
        // username: profile.username, // si también editas username, por ejemplo
        // points: profile.points, // points usualmente se actualizan por otras acciones, no directamente por el usuario
      };

      const { error: updateError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id); // Usar user.id que es la fuente de verdad

      if (updateError) throw updateError;

      toast.success('✅ Perfil actualizado correctamente.');
      setEditing(false);
      setOriginalProfileData(profile); // El nuevo estado guardado es ahora el "original"
      // Opcional: re-fetch profile si hay triggers o lógicas complejas en el backend
      // await fetchProfile(); 
    } catch (err: any) {
      console.error('Error updating profile:', err);
      toast.error('❌ Error al actualizar el perfil.', { description: err.message });
    } finally {
      setIsSaving(false);
    }
  }, [profile, user]); // fetchProfile si se usa arriba

  if (loading) {
    return (
      <div className="mt-6 p-4 border dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 shadow-sm text-center text-sm text-gray-500 dark:text-gray-400">
        <Loader2 className="animate-spin inline-block w-5 h-5 mr-2" />
        Cargando perfil...
      </div>
    );
  }

  if (error && !profile) { // Mostrar error solo si no hay perfil para mostrar
    return (
      <div className="mt-6 p-4 border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/30 rounded-md text-red-700 dark:text-red-300 text-center shadow-sm">
        <AlertTriangle className="inline-block w-5 h-5 mr-2" />
        {error}
      </div>
    );
  }
  
  if (!profile) {
    // Esto podría ser un estado donde el perfil aún no existe y se podría ofrecer crearlo.
    // O si el error fue 'Perfil no encontrado'.
    return (
        <div className="mt-6 p-4 border dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 shadow-sm text-center text-sm text-gray-500 dark:text-gray-400">
            <ShieldQuestion className="inline-block w-5 h-5 mr-2" />
            No se encontró información del perfil o aún no ha sido creado.
            {/* Aquí podrías poner un botón para "Crear Perfil" si aplica */}
        </div>
    );
  }

  // El email se toma directamente del objeto 'user' de Supabase Auth
  const displayEmail = user.email || profile.email || 'No disponible';

  return (
    <div className="mt-6 p-4 sm:p-6 bg-white dark:bg-gray-800/90 backdrop-blur-sm border dark:border-gray-700 rounded-xl shadow-xl space-y-4 text-sm selection:bg-blue-100 dark:selection:bg-yellow-700">
      <div className="flex items-center gap-3 mb-4 pb-3 border-b dark:border-gray-700">
        <UserCog className="w-7 h-7 text-blue-600 dark:text-yellow-400" />
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Mi Perfil</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
        <div>
          <span className="font-medium text-gray-500 dark:text-gray-400">Email:</span>
          <p className="text-gray-800 dark:text-gray-200 break-all">{displayEmail}</p>
        </div>
        <div>
          <span className="font-medium text-gray-500 dark:text-gray-400">Rol:</span>
          <p className="text-gray-800 dark:text-gray-200 capitalize">{profile.role || 'No asignado'}</p>
        </div>
        <div>
          <span className="font-medium text-gray-500 dark:text-gray-400">Puntos:</span>
          <p className="text-gray-800 dark:text-gray-200">{profile.points?.toLocaleString() || 0}</p>
        </div>
        
        {/* Campo de Suscripción (editable) */}
        <div className="sm:col-span-2 mt-2">
          <label htmlFor="subscription_checkbox" className="flex items-center gap-2 cursor-pointer w-fit">
            <input
              type="checkbox"
              id="subscription_checkbox"
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:checked:bg-yellow-500"
              checked={profile.subscription_ || false}
              onChange={handleSubscriptionChange}
              disabled={isSaving} 
            />
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Suscripción Activa 
              {profile.subscription_ ? 
                <CheckCircle className="inline-block w-4 h-4 ml-1 text-green-500" /> : 
                <XCircle className="inline-block w-4 h-4 ml-1 text-red-500" /> 
              }
            </span>
          </label>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t dark:border-gray-700">
        {editing ? (
          <form onSubmit={handleSave} className="flex flex-col sm:flex-row gap-3 items-center">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-yellow-500 dark:hover:bg-yellow-600 dark:text-gray-900 text-white rounded-md text-sm font-semibold disabled:opacity-60 transition-opacity"
            >
              {isSaving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save size={16} />}
              {isSaving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSaving}
              className="w-full sm:w-auto text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm underline px-4 py-2 rounded-md disabled:opacity-60"
            >
              Cancelar
            </button>
          </form>
        ) : (
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 text-blue-600 dark:text-yellow-400 hover:text-blue-700 dark:hover:text-yellow-500 text-sm font-semibold underline focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-yellow-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800 px-1 py-0.5 rounded"
          >
            <Edit3 size={14} />
            Editar Suscripción
          </button>
        )}
      </div>
    </div>
  );
}
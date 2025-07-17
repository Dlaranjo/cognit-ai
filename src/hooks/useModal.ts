import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/store';
import {
  openModal,
  closeModal,
  closeAllModals,
} from '../redux/ui/uiReducer';
import {
  selectModalById,
  selectIsModalOpen,
  selectModalData,
  selectOpenModals,
} from '../redux/ui/uiSelectors';

export const useModal = (modalId?: string) => {
  const dispatch = useAppDispatch();
  
  // Selectors
  const openModals = useAppSelector(selectOpenModals);
  
  // Modal-specific selectors (always call hooks, but use conditional logic)
  const modal = useAppSelector(state => modalId ? selectModalById(state, modalId) : null);
  const isOpen = useAppSelector(state => modalId ? selectIsModalOpen(state, modalId) : false);
  const data = useAppSelector(state => modalId ? selectModalData(state, modalId) : null);

  // Actions
  const open = useCallback((id: string, modalData?: unknown) => {
    dispatch(openModal({ modalId: id, data: modalData }));
  }, [dispatch]);

  const close = useCallback((id: string) => {
    dispatch(closeModal(id));
  }, [dispatch]);

  const closeAll = useCallback(() => {
    dispatch(closeAllModals());
  }, [dispatch]);

  // Modal-specific actions (if modalId provided)
  const openThis = useCallback((modalData?: unknown) => {
    if (modalId) {
      open(modalId, modalData);
    }
  }, [modalId, open]);

  const closeThis = useCallback(() => {
    if (modalId) {
      close(modalId);
    }
  }, [modalId, close]);

  const toggleThis = useCallback((modalData?: unknown) => {
    if (modalId) {
      if (isOpen) {
        closeThis();
      } else {
        openThis(modalData);
      }
    }
  }, [modalId, isOpen, openThis, closeThis]);

  // Helper functions - these return selector functions, not hook calls
  const isModalOpen = useCallback((id: string) => {
    // This returns a function that can be used with useAppSelector later
    return (state: any) => selectIsModalOpen(state, id);
  }, []);

  const getModalData = useCallback((id: string) => {
    // This returns a function that can be used with useAppSelector later
    return (state: any) => selectModalData(state, id);
  }, []);

  // Computed values
  const hasOpenModals = openModals.length > 0;
  const openModalCount = openModals.length;

  return {
    // State (for specific modal if modalId provided)
    modal,
    isOpen,
    data,
    
    // Global state
    openModals,
    hasOpenModals,
    openModalCount,
    
    // Actions
    open,
    close,
    closeAll,
    
    // Modal-specific actions (if modalId provided)
    openThis,
    closeThis,
    toggleThis,
    
    // Helpers
    isModalOpen,
    getModalData,
  };
};

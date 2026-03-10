import React from 'react';

const ConfirmationModal = ({ message, onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
    <div className="animate-fade-in mx-4 w-full max-w-sm rounded-xl border border-border-bright bg-bg-card p-8 text-center shadow-lg">
      <p className="mb-6 text-base font-semibold text-text-primary">{message}</p>
      <div className="flex justify-center gap-3">
        <button
          onClick={onCancel}
          className="rounded-full border border-border-bright bg-transparent px-5 py-2 text-sm font-semibold text-text-secondary transition-all hover:bg-border-default hover:text-text-primary"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="rounded-full bg-primary-dim px-5 py-2 text-sm font-bold text-white transition-all hover:bg-primary hover:shadow-glow-primary"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
);

export default ConfirmationModal;

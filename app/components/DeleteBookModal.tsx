'use client';

interface DeleteBookModalProps {
  isOpen: boolean;
  bookTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteBookModal({ 
  isOpen, 
  bookTitle, 
  onConfirm, 
  onCancel 
}: DeleteBookModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-fade-in">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Confirmar Exclusão
        </h3>
        <p className="text-gray-600 mb-6">
          Tem certeza que deseja excluir <strong>"{bookTitle}"</strong>? Esta ação não pode ser desfeita.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}